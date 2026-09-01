import asyncio
import io
import json
import os
import re
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from google import genai
from google.genai import types


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "").strip()


# =========================================================
# CORS CONFIGURATION
# =========================================================

LOCAL_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

ALLOWED_ORIGINS = LOCAL_ORIGINS.copy()

if FRONTEND_URL:
    for origin in FRONTEND_URL.split(","):
        origin = origin.strip().rstrip("/")

        if origin and origin not in ALLOWED_ORIGINS:
            ALLOWED_ORIGINS.append(origin)


# =========================================================
# GEMINI API KEY CHECK
# =========================================================

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing. "
        "Please add it to backend/.env"
    )


# =========================================================
# GEMINI CLIENT
# =========================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="InterviewAI API",
    description="AI Interview Preparation & Evaluation System",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# CONSTANTS
# =========================================================

MAX_RESUME_SIZE = 5 * 1024 * 1024
MAX_RESUME_TEXT = 20000
MAX_JOB_DESCRIPTION = 10000
MAX_ANSWER_LENGTH = 10000

MIN_QUESTIONS = 5
MAX_QUESTIONS = 20

GEMINI_MODEL = "gemini-3.6-flash"

# Retry only temporary Gemini availability errors.
MAX_EVALUATION_RETRIES = 3


# =========================================================
# ROOT ENDPOINT
# =========================================================

@app.get("/")
async def root():

    return {
        "status": "success",
        "message": "InterviewAI backend is running",
        "service": "AI Interview Preparation & Evaluation System",
        "version": "1.0.0",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
async def health():

    return {
        "status": "healthy",
        "gemini_configured": bool(GEMINI_API_KEY),
    }


# =========================================================
# GENERAL HELPERS
# =========================================================

def clean_text(value: Any) -> str:
    """
    Safely convert a value to trimmed text.
    """

    if value is None:
        return ""

    return str(value).strip()


def clamp_score(value: Any) -> int:
    """
    Convert a score to an integer between 0 and 100.
    """

    try:

        if isinstance(value, str):

            match = re.search(
                r"\d+(?:\.\d+)?",
                value
            )

            if not match:
                return 0

            value = float(
                match.group(0)
            )

        else:

            value = float(value)

        return round(
            max(
                0,
                min(
                    100,
                    value
                )
            )
        )

    except (
        TypeError,
        ValueError
    ):

        return 0


# =========================================================
# RESUME TEXT EXTRACTION
# =========================================================

async def extract_resume_text(
    resume: UploadFile,
) -> str:

    # -----------------------------------------------------
    # FILE NAME CHECK
    # -----------------------------------------------------

    if not resume.filename:

        raise HTTPException(
            status_code=400,
            detail="Resume file is missing.",
        )

    # -----------------------------------------------------
    # PDF CHECK
    # -----------------------------------------------------

    if not resume.filename.lower().endswith(".pdf"):

        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported.",
        )

    # -----------------------------------------------------
    # READ FILE
    # -----------------------------------------------------

    file_bytes = await resume.read()

    if not file_bytes:

        raise HTTPException(
            status_code=400,
            detail="Uploaded resume is empty.",
        )

    # -----------------------------------------------------
    # FILE SIZE LIMIT
    # -----------------------------------------------------

    if len(file_bytes) > MAX_RESUME_SIZE:

        raise HTTPException(
            status_code=400,
            detail="Resume must be smaller than 5 MB.",
        )

    # -----------------------------------------------------
    # EXTRACT PDF TEXT
    # -----------------------------------------------------

    try:

        pdf_file = io.BytesIO(
            file_bytes
        )

        reader = PdfReader(
            pdf_file
        )

        pages_text = []

        for page in reader.pages:

            text = page.extract_text()

            if text:

                pages_text.append(
                    text
                )

        resume_text = "\n".join(
            pages_text
        ).strip()

    except Exception as error:

        print(
            "PDF extraction error:",
            error,
        )

        raise HTTPException(
            status_code=400,
            detail="Could not read the PDF resume.",
        )

    # -----------------------------------------------------
    # EMPTY TEXT CHECK
    # -----------------------------------------------------

    if not resume_text:

        raise HTTPException(
            status_code=400,
            detail=(
                "Could not extract text from the resume. "
                "Please upload a text-based PDF."
            ),
        )

    return resume_text[:MAX_RESUME_TEXT]


# =========================================================
# CLEAN GEMINI JSON RESPONSE
# =========================================================

def clean_json_response(
    text: str,
):

    if not text:

        raise ValueError(
            "Gemini returned an empty response."
        )

    text = text.strip()

    # -----------------------------------------------------
    # REMOVE MARKDOWN CODE FENCES
    # -----------------------------------------------------

    text = re.sub(
        r"^```json\s*",
        "",
        text,
        flags=re.IGNORECASE,
    )

    text = re.sub(
        r"^```\s*",
        "",
        text,
    )

    text = re.sub(
        r"\s*```$",
        "",
        text,
    )

    text = text.strip()

    # -----------------------------------------------------
    # DIRECT JSON
    # -----------------------------------------------------

    try:

        return json.loads(
            text
        )

    except json.JSONDecodeError:

        pass

    # -----------------------------------------------------
    # EXTRACT JSON OBJECT
    # -----------------------------------------------------

    object_match = re.search(
        r"\{.*\}",
        text,
        flags=re.DOTALL
    )

    if object_match:

        try:

            return json.loads(
                object_match.group(0)
            )

        except json.JSONDecodeError:

            pass

    # -----------------------------------------------------
    # FAIL
    # -----------------------------------------------------

    raise ValueError(
        "Gemini returned invalid JSON."
    )


# =========================================================
# GENERATE AI INTERVIEW
# =========================================================

@app.post(
    "/api/generate-interview"
)
async def generate_interview(

    resume: UploadFile = File(...),

    role: str = Form(...),

    experience: str = Form(...),

    interview_type: str = Form(...),

    difficulty: str = Form(...),

    question_count: int = Form(...),

    job_description: str = Form(...),

):

    # =====================================================
    # VALIDATION
    # =====================================================

    role = clean_text(
        role
    )

    experience = clean_text(
        experience
    )

    interview_type = clean_text(
        interview_type
    )

    difficulty = clean_text(
        difficulty
    )

    job_description = clean_text(
        job_description
    )

    if not role:

        raise HTTPException(
            status_code=400,
            detail="Job role is required.",
        )

    if not experience:

        raise HTTPException(
            status_code=400,
            detail="Experience level is required.",
        )

    if not interview_type:

        raise HTTPException(
            status_code=400,
            detail="Interview type is required.",
        )

    if not difficulty:

        raise HTTPException(
            status_code=400,
            detail="Difficulty is required.",
        )

    if not job_description:

        raise HTTPException(
            status_code=400,
            detail="Job description is required.",
        )

    if (
        question_count < MIN_QUESTIONS
        or question_count > MAX_QUESTIONS
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                f"Question count must be between "
                f"{MIN_QUESTIONS} and {MAX_QUESTIONS}."
            ),
        )

    # =====================================================
    # EXTRACT RESUME
    # =====================================================

    resume_text = await extract_resume_text(
        resume
    )

    # =====================================================
    # GENERATION PROMPT
    # =====================================================

    prompt = f"""
You are an expert technical interviewer
and professional career coach.

Create a personalized mock interview
for the candidate.

CANDIDATE INFORMATION
=====================

Target Role:
{role}

Experience Level:
{experience}

Interview Type:
{interview_type}

Difficulty:
{difficulty}

Number of Questions:
{question_count}

JOB DESCRIPTION
===============
{job_description[:MAX_JOB_DESCRIPTION]}

RESUME
======
{resume_text}

TASK
====

Create exactly {question_count}
high-quality interview questions.

Requirements:

1. Questions must be relevant to the target role.

2. Analyze the candidate's resume and
   personalize relevant questions.

3. Analyze the job description and
   focus on required skills.

4. Match the candidate's experience level.

5. Match the requested difficulty.

6. Respect the selected interview type.

7. Avoid duplicate questions.

8. Ask about projects or experience
   mentioned in the resume when relevant.

9. For Technical interviews:
   focus on technical concepts,
   programming, problem solving,
   databases, APIs, systems,
   tools and role-specific skills.

10. For HR interviews:
    focus on behavioral,
    communication, teamwork,
    leadership and workplace situations.

11. For Mixed interviews:
    combine technical and behavioral questions.

12. Do not provide answers.

13. Do not add unnecessary explanations.

14. Make the questions realistic
    for an actual interview.

RETURN ONLY VALID JSON.

Use exactly this format:

{{
  "questions": [
    {{
      "id": 1,
      "type": "Technical",
      "question": "Question text",
      "difficulty": "Medium",
      "skill": "Python",
      "why_asked": "Brief reason this question is relevant"
    }}
  ]
}}
"""

    # =====================================================
    # GEMINI REQUEST
    # =====================================================

    try:

        response = client.models.generate_content(

            model=GEMINI_MODEL,

            contents=prompt,

            config=types.GenerateContentConfig(

                temperature=0.7,

                max_output_tokens=5000,

                response_mime_type="application/json",
            ),
        )

        response_text = response.text

    except Exception as error:

        print(
            "Gemini generation error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Gemini API request failed. "
                "Please try again."
            ),
        )

    # =====================================================
    # PARSE RESPONSE
    # =====================================================

    try:

        result = clean_json_response(
            response_text
        )

    except ValueError as error:

        print(
            "Generation JSON error:",
            error,
        )

        print(
            "Gemini response:",
            response_text,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "AI generated an invalid interview response."
            ),
        )

    # =====================================================
    # VALIDATE QUESTIONS
    # =====================================================

    questions = result.get(
        "questions"
    )

    if not isinstance(
        questions,
        list,
    ):

        raise HTTPException(
            status_code=500,
            detail=(
                "AI response does not contain "
                "a valid questions list."
            ),
        )

    if len(questions) == 0:

        raise HTTPException(
            status_code=500,
            detail=(
                "AI did not generate any questions."
            ),
        )

    # =====================================================
    # NORMALIZE QUESTIONS
    # =====================================================

    normalized_questions = []

    for index, item in enumerate(
        questions[:question_count]
    ):

        if not isinstance(
            item,
            dict,
        ):

            continue

        normalized_questions.append(
            {
                "id": item.get(
                    "id",
                    index + 1,
                ),

                "type": clean_text(
                    item.get(
                        "type",
                        "Technical",
                    )
                ),

                "question": clean_text(
                    item.get(
                        "question",
                        "",
                    )
                ),

                "difficulty": clean_text(
                    item.get(
                        "difficulty",
                        difficulty,
                    )
                ),

                "skill": clean_text(
                    item.get(
                        "skill",
                        "General",
                    )
                ),

                "why_asked": clean_text(
                    item.get(
                        "why_asked",
                        (
                            "This question evaluates "
                            "a skill relevant to the "
                            "target role."
                        ),
                    )
                ),
            }
        )

    if not normalized_questions:

        raise HTTPException(
            status_code=500,
            detail=(
                "AI did not generate valid interview questions."
            ),
        )

    # =====================================================
    # RETURN
    # =====================================================

    return {

        "success": True,

        "interview": {

            "role": role,

            "experience": experience,

            "interview_type": interview_type,

            "difficulty": difficulty,

            "question_count": len(
                normalized_questions
            ),
        },

        "resume": {

            "filename": resume.filename,

            "characters_extracted": len(
                resume_text
            ),
        },

        "questions": normalized_questions,
    }


# =========================================================
# EVALUATE COMPLETED INTERVIEW
# =========================================================

@app.post(
    "/api/evaluate-interview"
)
async def evaluate_interview(

    role: str = Form(...),

    experience: str = Form(...),

    interview_type: str = Form(...),

    difficulty: str = Form(...),

    job_description: str = Form(...),

    questions: str = Form(...),

    answers: str = Form(...),

):

    # =====================================================
    # VALIDATION
    # =====================================================

    role = clean_text(
        role
    )

    experience = clean_text(
        experience
    )

    interview_type = clean_text(
        interview_type
    )

    difficulty = clean_text(
        difficulty
    )

    job_description = clean_text(
        job_description
    )

    if not role:

        raise HTTPException(
            status_code=400,
            detail="Job role is required.",
        )

    if not experience:

        raise HTTPException(
            status_code=400,
            detail="Experience level is required.",
        )

    if not questions.strip():

        raise HTTPException(
            status_code=400,
            detail="Interview questions are required.",
        )

    if not answers.strip():

        raise HTTPException(
            status_code=400,
            detail="Candidate answers are required.",
        )

    # =====================================================
    # PARSE QUESTIONS AND ANSWERS
    # =====================================================

    try:

        questions_data = json.loads(
            questions
        )

        answers_data = json.loads(
            answers
        )

    except json.JSONDecodeError:

        raise HTTPException(
            status_code=400,
            detail=(
                "Questions or answers contain "
                "invalid JSON."
            ),
        )

    if not isinstance(
        questions_data,
        list,
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Questions must be a JSON list."
            ),
        )

    if not isinstance(
        answers_data,
        dict,
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Answers must be a JSON object."
            ),
        )

    if len(questions_data) == 0:

        raise HTTPException(
            status_code=400,
            detail=(
                "At least one interview question "
                "is required."
            ),
        )

    # =====================================================
    # BUILD EVALUATION DATA
    # =====================================================

    interview_content = []

    for index, question in enumerate(
        questions_data
    ):

        if not isinstance(
            question,
            dict,
        ):

            continue

        question_text = clean_text(
            question.get(
                "question",
                "",
            )
        )

        question_type = clean_text(
            question.get(
                "type",
                "General",
            )
        )

        question_difficulty = clean_text(
            question.get(
                "difficulty",
                difficulty,
            )
        )

        skill = clean_text(
            question.get(
                "skill",
                "General",
            )
        )

        # -------------------------------------------------
        # ANSWER INDEX
        # -------------------------------------------------

        candidate_answer = answers_data.get(
            str(index),
            "",
        )

        if candidate_answer is None:

            candidate_answer = ""

        if not isinstance(
            candidate_answer,
            str,
        ):

            candidate_answer = str(
                candidate_answer
            )

        interview_content.append(
            {
                "question_number":
                    index + 1,

                "type":
                    question_type,

                "difficulty":
                    question_difficulty,

                "skill":
                    skill,

                "question":
                    question_text,

                "candidate_answer":
                    candidate_answer[
                        :MAX_ANSWER_LENGTH
                    ],
            }
        )

    if not interview_content:

        raise HTTPException(
            status_code=400,
            detail=(
                "No valid interview questions were provided."
            ),
        )

    # =====================================================
    # EVALUATION PROMPT
    # =====================================================

    prompt = f"""
You are an expert technical interviewer,
hiring manager and professional career coach.

Evaluate the candidate's completed mock interview.

CANDIDATE INFORMATION
=====================

Target Role:
{role}

Experience Level:
{experience}

Interview Type:
{interview_type}

Difficulty:
{difficulty}

JOB DESCRIPTION
===============
{job_description[:MAX_JOB_DESCRIPTION]}

QUESTIONS AND CANDIDATE ANSWERS
================================

{json.dumps(
    interview_content,
    indent=2,
    ensure_ascii=False,
)}

EVALUATION CRITERIA
===================

Evaluate the candidate fairly and professionally.

Consider:

1. Technical correctness
2. Understanding of concepts
3. Relevance to the question
4. Problem-solving ability
5. Communication quality
6. Clarity of explanation
7. Completeness of answers
8. Alignment with the target role
9. Alignment with the job description
10. Overall interview readiness

SCORING RULES
=============

- Every score must be between 0 and 100.
- Do not give high scores simply because an answer is long.
- Do not penalize a short answer if it is technically correct.
- Identify incorrect technical claims.
- Identify incomplete answers.
- Give constructive feedback.
- Do not invent skills the candidate did not demonstrate.
- Evaluate every question individually.
- Overall score should represent the complete interview.
- Be realistic for a professional interview.

PERFORMANCE LEVELS

90-100 = Excellent
80-89  = Very Good
70-79  = Good
60-69  = Needs Improvement
0-59   = Needs Significant Improvement

RETURN ONLY VALID JSON.

Use exactly this structure:

{{
  "overall_score": 82,

  "category_scores": {{
    "technical_skills": 85,
    "communication": 78,
    "problem_solving": 84,
    "role_alignment": 81
  }},

  "performance_level": "Very Good",

  "summary": "A concise professional summary of the candidate's overall interview performance.",

  "strengths": [
    "Strong understanding of core technical concepts.",
    "Good explanation of project experience.",
    "Clear communication."
  ],

  "areas_to_improve": [
    "Provide more specific examples.",
    "Improve technical answer structure.",
    "Strengthen advanced technical concepts."
  ],

  "recommendation": "A concise recommendation about the candidate's interview readiness.",

  "question_evaluations": [
    {{
      "question_number": 1,
      "score": 85,
      "evaluation": "Brief evaluation of the candidate's answer.",
      "what_was_good": "What the candidate did well.",
      "what_to_improve": "What could be improved.",
      "ideal_answer_points": [
        "Important point one",
        "Important point two"
      ]
    }}
  ]
}}

IMPORTANT:

The question_evaluations array MUST contain exactly
one evaluation for every interview question.

Do not omit unanswered questions.

For unanswered questions:
- score should normally be 0
- clearly state that no answer was provided
- explain what should have been covered.
"""

    # =====================================================
    # GEMINI EVALUATION REQUEST WITH RETRY
    # =====================================================

    response_text = None

    for attempt in range(
        1,
        MAX_EVALUATION_RETRIES + 1
    ):

        try:

            print(
                f"Starting Gemini evaluation attempt "
                f"{attempt}/{MAX_EVALUATION_RETRIES}..."
            )

            response = client.models.generate_content(

                model=GEMINI_MODEL,

                contents=prompt,

                config=types.GenerateContentConfig(

                    temperature=0.4,

                    max_output_tokens=8000,

                    response_mime_type="application/json",
                ),
            )

            response_text = response.text

            print(
                f"Gemini evaluation succeeded on "
                f"attempt {attempt}."
            )

            break

        except Exception as error:

            error_text = str(
                error
            )

            error_upper = error_text.upper()

            print(
                f"Gemini evaluation attempt "
                f"{attempt} failed:"
            )

            print(
                error_text
            )

            # -------------------------------------------------
            # TEMPORARY 503 / UNAVAILABLE
            # -------------------------------------------------

            is_unavailable = (
                "503" in error_text
                or "UNAVAILABLE" in error_upper
                or "SERVICE UNAVAILABLE" in error_upper
            )

            if is_unavailable:

                if attempt < MAX_EVALUATION_RETRIES:

                    retry_delay = 2 ** attempt

                    print(
                        "Gemini model is temporarily "
                        "unavailable because of high demand."
                    )

                    print(
                        f"Retrying in "
                        f"{retry_delay} seconds..."
                    )

                    await asyncio.sleep(
                        retry_delay
                    )

                    continue

                print(
                    "Gemini evaluation failed after "
                    "all retry attempts."
                )

                raise HTTPException(
                    status_code=503,
                    detail=(
                        "Gemini is temporarily unavailable "
                        "because the model is experiencing "
                        "high demand. Please try again shortly."
                    ),
                )

            # -------------------------------------------------
            # 429 QUOTA / RATE LIMIT
            # -------------------------------------------------

            is_quota_error = (
                "429" in error_text
                or "RESOURCE_EXHAUSTED" in error_upper
                or "QUOTA" in error_upper
                or "RATE LIMIT" in error_upper
            )

            if is_quota_error:

                print(
                    "Gemini API quota or rate limit "
                    "has been reached."
                )

                raise HTTPException(
                    status_code=429,
                    detail=(
                        "Gemini API usage limit has been "
                        "reached. Please try again later."
                    ),
                )

            # -------------------------------------------------
            # OTHER GEMINI ERRORS
            # -------------------------------------------------

            raise HTTPException(
                status_code=500,
                detail=(
                    "Gemini evaluation failed. "
                    "Please try again."
                ),
            )

    # =====================================================
    # SAFETY CHECK
    # =====================================================

    if not response_text:

        raise HTTPException(
            status_code=503,
            detail=(
                "Gemini did not return an evaluation. "
                "Please try again shortly."
            ),
        )

    # =====================================================
    # PARSE EVALUATION
    # =====================================================

    try:

        evaluation = clean_json_response(
            response_text
        )

    except ValueError as error:

        print(
            "Evaluation JSON error:",
            error,
        )

        print(
            "Gemini evaluation response:",
            response_text,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "AI returned an invalid evaluation response."
            ),
        )

    # =====================================================
    # VALIDATE EVALUATION
    # =====================================================

    required_fields = [

        "overall_score",

        "category_scores",

        "performance_level",

        "summary",

        "strengths",

        "areas_to_improve",

        "recommendation",

        "question_evaluations",

    ]

    for field in required_fields:

        if field not in evaluation:

            raise HTTPException(
                status_code=500,
                detail=(
                    f"AI evaluation is missing "
                    f"the '{field}' field."
                ),
            )

    # =====================================================
    # NORMALIZE TOP-LEVEL VALUES
    # =====================================================

    evaluation["overall_score"] = clamp_score(

        evaluation.get(
            "overall_score",
            0,
        )

    )

    evaluation["performance_level"] = clean_text(

        evaluation.get(
            "performance_level",
            "Not Available",
        )

    )

    evaluation["summary"] = clean_text(

        evaluation.get(
            "summary",
            "",
        )

    )

    evaluation["recommendation"] = clean_text(

        evaluation.get(
            "recommendation",
            "",
        )

    )

    # =====================================================
    # CATEGORY SCORE VALIDATION
    # =====================================================

    category_scores = evaluation.get(
        "category_scores",
        {},
    )

    if not isinstance(
        category_scores,
        dict,
    ):

        category_scores = {}

    expected_categories = [

        "technical_skills",

        "communication",

        "problem_solving",

        "role_alignment",

    ]

    for category in expected_categories:

        category_scores[category] = clamp_score(

            category_scores.get(
                category,
                0,
            )

        )

    evaluation[
        "category_scores"
    ] = category_scores

    # =====================================================
    # NORMALIZE LIST FIELDS
    # =====================================================

    for field in [

        "strengths",

        "areas_to_improve",

    ]:

        value = evaluation.get(
            field,
            [],
        )

        if not isinstance(
            value,
            list,
        ):

            value = (
                [str(value)]
                if value
                else []
            )

        evaluation[field] = [

            clean_text(item)

            for item in value

            if clean_text(item)

        ]

    # =====================================================
    # QUESTION EVALUATION VALIDATION
    # =====================================================

    question_evaluations = evaluation.get(

        "question_evaluations",

        [],

    )

    if not isinstance(
        question_evaluations,
        list,
    ):

        question_evaluations = []

    normalized_evaluations = []

    for index, item in enumerate(
        question_evaluations
    ):

        if not isinstance(
            item,
            dict,
        ):

            continue

        ideal_points = item.get(

            "ideal_answer_points",

            [],

        )

        if not isinstance(
            ideal_points,
            list,
        ):

            ideal_points = (

                [str(ideal_points)]

                if ideal_points

                else []

            )

        normalized_evaluations.append(

            {
                "question_number":
                    index + 1,

                "score":
                    clamp_score(

                        item.get(
                            "score",
                            0,
                        )

                    ),

                "evaluation":
                    clean_text(

                        item.get(
                            "evaluation",
                            "",
                        )

                    ),

                "what_was_good":
                    clean_text(

                        item.get(
                            "what_was_good",
                            "",
                        )

                    ),

                "what_to_improve":
                    clean_text(

                        item.get(
                            "what_to_improve",
                            "",
                        )

                    ),

                "ideal_answer_points": [

                    clean_text(point)

                    for point in ideal_points

                    if clean_text(point)

                ],

            }

        )

    evaluation[
        "question_evaluations"
    ] = normalized_evaluations

    # =====================================================
    # RETURN FINAL EVALUATION
    # =====================================================

    return {

        "success": True,

        "candidate": {

            "role":
                role,

            "experience":
                experience,

            "interview_type":
                interview_type,

            "difficulty":
                difficulty,

        },

        "evaluation":
            evaluation,

    }


# =========================================================
# DEVELOPMENT / PRODUCTION COMMAND
# =========================================================
#
# Local development:
#
# uvicorn main:app --reload --port 8000
#
# Production:
#
# uvicorn main:app --host 0.0.0.0 --port 8000
#
# =========================================================