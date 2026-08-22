import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Brain,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  X
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


/* =========================================================
   FALLBACK QUESTIONS

   These are used ONLY if AI questions are not available.
   Normally your FastAPI + Gemini questions will be used.
========================================================= */

const mockQuestions = [
  {
    id: 1,
    type: "Technical",
    question:
      "What is the difference between let, const and var in JavaScript?",
    difficulty: "Medium",
    skill: "JavaScript",
    why_asked:
      "This tests your understanding of JavaScript variables, scope and modern JavaScript practices."
  },

  {
    id: 2,
    type: "Technical",
    question:
      "What is the difference between SQL JOINs and when would you use them?",
    difficulty: "Medium",
    skill: "SQL",
    why_asked:
      "This evaluates your understanding of relational databases and how tables are combined."
  },

  {
    id: 3,
    type: "Technical",
    question:
      "Explain the concept of REST APIs and the HTTP methods commonly used.",
    difficulty: "Medium",
    skill: "REST API",
    why_asked:
      "This tests your understanding of backend communication and API design."
  },

  {
    id: 4,
    type: "Technical",
    question:
      "What is the difference between authentication and authorization?",
    difficulty: "Easy",
    skill: "Web Security",
    why_asked:
      "This checks your understanding of basic application security concepts."
  },

  {
    id: 5,
    type: "Technical",
    question:
      "How would you optimize a web application that is becoming slow?",
    difficulty: "Hard",
    skill: "Performance",
    why_asked:
      "This evaluates your ability to identify and solve performance bottlenecks."
  },

  {
    id: 6,
    type: "Behavioral",
    question:
      "Tell me about a challenging project you worked on and how you solved the problem.",
    difficulty: "Medium",
    skill: "Problem Solving",
    why_asked:
      "Use the STAR method to demonstrate problem-solving, ownership and project experience."
  },

  {
    id: 7,
    type: "Behavioral",
    question:
      "How do you handle a situation where you disagree with a teammate?",
    difficulty: "Medium",
    skill: "Communication",
    why_asked:
      "This evaluates your communication, teamwork and conflict-resolution skills."
  },

  {
    id: 8,
    type: "Technical",
    question:
      "What is the difference between supervised and unsupervised machine learning?",
    difficulty: "Medium",
    skill: "Machine Learning",
    why_asked:
      "This tests your understanding of fundamental machine learning concepts."
  },

  {
    id: 9,
    type: "Behavioral",
    question:
      "Where do you see yourself professionally in the next three years?",
    difficulty: "Easy",
    skill: "Career Goals",
    why_asked:
      "This helps evaluate your career direction, motivation and alignment with the role."
  },

  {
    id: 10,
    type: "Mixed",
    question:
      "Why should we hire you for this position?",
    difficulty: "Medium",
    skill: "Communication",
    why_asked:
      "This evaluates how effectively you connect your skills and experience to the target role."
  }
];


/* =========================================================
   INTERVIEW COMPONENT
========================================================= */

function Interview() {

  const navigate = useNavigate();

  const location = useLocation();


  /* =======================================================
     DATA RECEIVED FROM SETUP INTERVIEW
  ======================================================= */

  const interviewData =
    location.state || {};


  const role =
    interviewData.role ||
    "Software Engineer";


  const experience =
    interviewData.experience ||
    "Fresher";


  const interviewType =
    interviewData.interviewType ||
    "Mixed";


  const difficulty =
    interviewData.difficulty ||
    "Medium";


  const resumeName =
    interviewData.resumeName ||
    "";


  const jobDescription =
    interviewData.jobDescription ||
    "";


  /* =======================================================
     AI QUESTIONS

     SetupInterview.jsx sends:

     questions: data.questions
  ======================================================= */

  const aiQuestions =
    Array.isArray(
      interviewData.questions
    )
      ? interviewData.questions
      : [];


  /* =======================================================
     NORMALIZE QUESTIONS

     This makes sure Gemini responses always match
     what the UI expects.
  ======================================================= */

  const questions = useMemo(() => {

    if (aiQuestions.length > 0) {

      return aiQuestions.map(
        (item, index) => {

          return {

            id:
              item.id ||
              index + 1,

            type:
              item.type ||
              "Technical",

            question:
              item.question ||
              "Please answer this interview question.",

            difficulty:
              item.difficulty ||
              difficulty,

            skill:
              item.skill ||
              "General",

            why_asked:
              item.why_asked ||
              item.hint ||
              "Explain your answer clearly and provide relevant examples."

          };

        }
      );

    }


    /* =====================================================
       FALLBACK TO MOCK QUESTIONS
    ===================================================== */

    const requestedQuestions =
      Number(
        interviewData.questionCount ||
        10
      );


    return mockQuestions.slice(
      0,
      Math.min(
        requestedQuestions,
        mockQuestions.length
      )
    );

  }, [
    aiQuestions,
    difficulty,
    interviewData.questionCount
  ]);


  /* =======================================================
     STATE
  ======================================================= */

  const [
    currentQuestion,
    setCurrentQuestion
  ] = useState(0);


  const [
    answers,
    setAnswers
  ] = useState({});


  const [
    timeLeft,
    setTimeLeft
  ] = useState(180);


  const [
    showHint,
    setShowHint
  ] = useState(false);


  const [
    showSubmitModal,
    setShowSubmitModal
  ] = useState(false);


  const [
    submitted,
    setSubmitted
  ] = useState(false);


  /* =======================================================
     NEW STATES FOR AI EVALUATION
  ======================================================= */

  const [
    isEvaluating,
    setIsEvaluating
  ] = useState(false);


  const [
    evaluationError,
    setEvaluationError
  ] = useState("");


  /* =======================================================
     CURRENT QUESTION
  ======================================================= */

  const question =
    questions[currentQuestion];


  /* =======================================================
     ANSWERED COUNT
  ======================================================= */

  const answeredCount =
    Object.values(
      answers
    ).filter(
      (answer) =>
        typeof answer === "string" &&
        answer.trim().length > 0
    ).length;


  /* =======================================================
     PROGRESS
  ======================================================= */

  const progress =
    questions.length > 0
      ? (
          (currentQuestion + 1) /
          questions.length
        ) * 100
      : 0;


  /* =======================================================
     TIMER
  ======================================================= */

  useEffect(() => {

    if (
      submitted ||
      isEvaluating
    ) {
      return;
    }


    if (
      timeLeft <= 0
    ) {
      return;
    }


    const timer =
      setInterval(() => {

        setTimeLeft(
          (previous) =>
            previous - 1
        );

      }, 1000);


    return () => {

      clearInterval(
        timer
      );

    };

  }, [
    timeLeft,
    submitted,
    isEvaluating
  ]);


  /* =======================================================
     RESET TIMER WHEN QUESTION CHANGES
  ======================================================= */

  useEffect(() => {

    setTimeLeft(180);

    setShowHint(false);

  }, [
    currentQuestion
  ]);


  /* =======================================================
     FORMAT TIMER
  ======================================================= */

  const formatTime = () => {

    const minutes =
      Math.floor(
        timeLeft / 60
      );


    const seconds =
      timeLeft % 60;


    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

  };


  /* =======================================================
     ANSWER CHANGE
  ======================================================= */

  const handleAnswerChange = (
    event
  ) => {

    setAnswers(
      (previous) => ({

        ...previous,

        [currentQuestion]:
          event.target.value

      })
    );

  };


  /* =======================================================
     NEXT QUESTION
  ======================================================= */

  const nextQuestion = () => {

    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        (previous) =>
          previous + 1
      );

    }

  };


  /* =======================================================
     PREVIOUS QUESTION
  ======================================================= */

  const previousQuestion = () => {

    if (
      currentQuestion > 0
    ) {

      setCurrentQuestion(
        (previous) =>
          previous - 1
      );

    }

  };


  /* =======================================================
     QUESTION NAVIGATION
  ======================================================= */

  const handleQuestionClick = (
    index
  ) => {

    setCurrentQuestion(
      index
    );

  };


  /* =======================================================
     SUBMIT INTERVIEW
     
     THIS IS THE IMPORTANT NEW PART.

     It sends:

     role
     experience
     interview type
     difficulty
     job description
     questions
     answers

     to:

     POST /api/evaluate-interview

  ======================================================= */

  const submitInterview = async () => {

    try {

      /* ---------------------------------------------------
         CLOSE CONFIRMATION MODAL
      --------------------------------------------------- */

      setShowSubmitModal(
        false
      );


      /* ---------------------------------------------------
         START EVALUATION
      --------------------------------------------------- */

      setIsEvaluating(
        true
      );


      setEvaluationError(
        ""
      );


      /* ---------------------------------------------------
         CREATE FORM DATA
      --------------------------------------------------- */

      const formData =
        new FormData();


      /* ---------------------------------------------------
         CANDIDATE INFORMATION
      --------------------------------------------------- */

      formData.append(
        "role",
        role
      );


      formData.append(
        "experience",
        experience
      );


      formData.append(
        "interview_type",
        interviewType
      );


      formData.append(
        "difficulty",
        difficulty
      );


      /* ---------------------------------------------------
         JOB DESCRIPTION
      --------------------------------------------------- */

      formData.append(
        "job_description",
        jobDescription
      );


      /* ---------------------------------------------------
         QUESTIONS
      --------------------------------------------------- */

      formData.append(
        "questions",
        JSON.stringify(
          questions
        )
      );


      /* ---------------------------------------------------
         CANDIDATE ANSWERS
      --------------------------------------------------- */

      formData.append(
        "answers",
        JSON.stringify(
          answers
        )
      );


      /* ---------------------------------------------------
         CALL FASTAPI
      --------------------------------------------------- */
const response =
  await fetch(
    `${API_URL}/api/evaluate-interview`,
    {
      method: "POST",
      body: formData
    }
  );

      /* ---------------------------------------------------
         READ BACKEND RESPONSE
      --------------------------------------------------- */

      const data =
        await response.json();


      /* ---------------------------------------------------
         HANDLE HTTP ERROR
      --------------------------------------------------- */

      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Interview evaluation failed."
        );

      }


      /* ---------------------------------------------------
         HANDLE API ERROR
      --------------------------------------------------- */

      if (
        !data.success
      ) {

        throw new Error(
          "AI evaluation was not successful."
        );

      }


      /* ---------------------------------------------------
         SUCCESS
      --------------------------------------------------- */

      setSubmitted(
        true
      );


      /* ---------------------------------------------------
         MOVE TO RESULTS PAGE
      --------------------------------------------------- */

      setTimeout(() => {

        navigate(
          "/results",
          {
            state: {

              role,

              experience,

              interviewType,

              difficulty,

              resumeName,

              jobDescription,

              questions,

              answers,

              candidate:
                data.candidate,

              evaluation:
                data.evaluation

            }
          }
        );

      }, 800);


    } catch (error) {

      console.error(
        "Interview evaluation error:",
        error
      );


      setIsEvaluating(
        false
      );


      setEvaluationError(
        error.message ||
        "Something went wrong while evaluating the interview."
      );

    }

  };


  /* =======================================================
     NO QUESTIONS FALLBACK
  ======================================================= */

  if (!question) {

    return (

      <div className="interview-page">

        <div className="interview-empty">

          <AlertCircle
            size={35}
          />


          <h2>
            No interview questions available
          </h2>


          <p>
            Please return to setup and
            generate the interview again.
          </p>


          <button
            onClick={() =>
              navigate("/setup")
            }
          >

            Back to Setup

          </button>

        </div>

      </div>

    );

  }


  /* =======================================================
     MAIN UI
  ======================================================= */

  return (

    <div className="interview-page">


      {/* ===================================================
          TOP NAVBAR
      =================================================== */}

      <header className="interview-navbar">


        <div className="interview-brand">

          <div className="brand-icon">

            <Brain
              size={20}
            />

          </div>


          <div>

            <strong>
              InterviewAI
            </strong>

            <span>
              AI Interview Coach
            </span>

          </div>

        </div>


        <div className="interview-title">

          <strong>
            {role}
          </strong>


          <span>
            {interviewType} Interview
          </span>

        </div>


        <button
          className="exit-interview"
          onClick={() =>
            navigate("/setup")
          }
          disabled={
            isEvaluating
          }
        >

          <X
            size={15}
          />

          Exit

        </button>

      </header>


      {/* ===================================================
          PROGRESS BAR
      =================================================== */}

      <div className="interview-progress-container">


        <div className="interview-progress-info">


          <span>

            Question{" "}
            {currentQuestion + 1}{" "}
            of{" "}
            {questions.length}

          </span>


          <span>

            {Math.round(
              progress
            )}
            % complete

          </span>

        </div>


        <div className="interview-progress">

          <div
            style={{
              width:
                `${progress}%`
            }}
          />

        </div>

      </div>


      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <main className="interview-container">


        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <section className="interview-main-card">


          {/* =================================================
              QUESTION HEADER
          ================================================= */}

          <div className="question-header">


            <div>


              <div className="question-label">


                <span>

                  QUESTION{" "}
                  {String(
                    currentQuestion + 1
                  ).padStart(
                    2,
                    "0"
                  )}

                </span>


                <span className="question-type">

                  {question.type}

                </span>

              </div>


              <h1>

                {question.question}

              </h1>


              {/* AI QUESTION META */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "10px",
                  flexWrap: "wrap"
                }}
              >

                <span
                  style={{
                    fontSize: "8px",
                    color: "#8d7be1",
                    padding: "4px 8px",
                    borderRadius: "20px",
                    background:
                      "rgba(124,92,255,0.07)",
                    border:
                      "1px solid rgba(124,92,255,0.12)"
                  }}
                >

                  {question.difficulty}

                </span>


                <span
                  style={{
                    fontSize: "8px",
                    color: "#73778a",
                    padding: "4px 8px",
                    borderRadius: "20px",
                    background:
                      "rgba(255,255,255,0.035)"
                  }}
                >

                  {question.skill}

                </span>

              </div>

            </div>


            {/* TIMER */}

            <div
              className={
                timeLeft <= 30
                  ? "timer danger"
                  : "timer"
              }
            >

              <Clock3
                size={17}
              />

              <span>

                {formatTime()}

              </span>

            </div>

          </div>


          {/* =================================================
              AI CONTEXT
          ================================================= */}

          <div className="ai-context">


            <div className="ai-context-icon">

              <Sparkles
                size={17}
              />

            </div>


            <div>

              <strong>
                AI Interview Coach
              </strong>


              <p>

                Take your time and explain
                your reasoning clearly.
                The AI will evaluate your answer
                based on accuracy, clarity,
                relevance and communication.

              </p>

            </div>

          </div>


          {/* =================================================
              ANSWER AREA
          ================================================= */}

          <div className="answer-section">


            <div className="answer-heading">


              <label>
                Your Answer
              </label>


              <span>

                {
                  (
                    answers[
                      currentQuestion
                    ] || ""
                  ).length
                }

                {" characters"}

              </span>

            </div>


            <textarea

              value={
                answers[
                  currentQuestion
                ] || ""
              }

              onChange={
                handleAnswerChange
              }

              disabled={
                isEvaluating ||
                submitted
              }

              placeholder={
                `Type your answer here...

Try to explain your answer clearly and provide examples where appropriate.`
              }

            />

          </div>


          {/* =================================================
              HINT
          ================================================= */}

          {showHint && (

            <div className="hint-box">


              <div className="hint-icon">

                <Lightbulb
                  size={17}
                />

              </div>


              <div>

                <strong>
                  Interview Tip
                </strong>


                <p>

                  {question.why_asked ||
                    "Explain your answer clearly and provide relevant examples."}

                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setShowHint(false)
                }
              >

                <X
                  size={14}
                />

              </button>

            </div>

          )}


          {/* =================================================
              BOTTOM CONTROLS
          ================================================= */}

          <div className="question-controls">


            {/* PREVIOUS */}

            <button
              className="previous-button"
              disabled={
                currentQuestion === 0 ||
                isEvaluating
              }
              onClick={
                previousQuestion
              }
            >

              <ChevronLeft
                size={17}
              />

              Previous

            </button>


            {/* HINT */}

            <button
              className="hint-button"
              disabled={
                isEvaluating
              }
              onClick={() =>
                setShowHint(
                  !showHint
                )
              }
            >

              <Lightbulb
                size={16}
              />

              {showHint
                ? "Hide Hint"
                : "Need a Hint?"}

            </button>


            {/* NEXT / SUBMIT */}

            {currentQuestion ===
            questions.length - 1 ? (

              <button
                className="submit-button"
                disabled={
                  isEvaluating ||
                  submitted
                }
                onClick={() =>
                  setShowSubmitModal(
                    true
                  )
                }
              >

                <Send
                  size={16}
                />

                Submit Interview

              </button>

            ) : (

              <button
                className="next-button"
                disabled={
                  isEvaluating
                }
                onClick={
                  nextQuestion
                }
              >

                Next Question

                <ChevronRight
                  size={17}
                />

              </button>

            )}

          </div>

        </section>


        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <aside className="interview-sidebar">


          {/* =================================================
              SESSION CARD
          ================================================= */}

          <div className="session-card">


            <div className="session-header">


              <div>

                <span className="sidebar-label">

                  INTERVIEW SESSION

                </span>


                <h3>

                  {role}

                </h3>

              </div>


              <div className="session-status">

                LIVE

              </div>

            </div>


            <div className="session-details">


              <div>

                <span>
                  Experience
                </span>

                <strong>
                  {experience}
                </strong>

              </div>


              <div>

                <span>
                  Type
                </span>

                <strong>
                  {interviewType}
                </strong>

              </div>


              <div>

                <span>
                  Difficulty
                </span>

                <strong>
                  {difficulty}
                </strong>

              </div>


              <div>

                <span>
                  Questions
                </span>

                <strong>
                  {questions.length}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              QUESTIONS NAVIGATION
          ================================================= */}

          <div className="question-list-card">


            <div className="sidebar-title">


              <div>

                <strong>
                  Interview Questions
                </strong>


                <span>

                  {answeredCount}/
                  {questions.length}
                  {" answered"}

                </span>

              </div>

            </div>


            <div className="question-list">


              {questions.map(
                (item, index) => {


                  const answer =
                    answers[index] ||
                    "";


                  const isAnswered =
                    typeof answer ===
                      "string" &&
                    answer.trim()
                      .length > 0;


                  const isCurrent =
                    index ===
                    currentQuestion;


                  return (

                    <button
                      type="button"
                      key={
                        item.id ||
                        index
                      }

                      className={
                        isCurrent
                          ? "question-number active"
                          : isAnswered
                          ? "question-number answered"
                          : "question-number"
                      }

                      disabled={
                        isEvaluating
                      }

                      onClick={() =>
                        handleQuestionClick(
                          index
                        )
                      }
                    >


                      <span>

                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}

                      </span>


                      <div>

                        <strong>

                          {item.type ||
                            "Technical"}

                        </strong>


                        <p>

                          {item.question}

                        </p>

                      </div>


                      {isAnswered && (

                        <CheckCircle2
                          size={15}
                        />

                      )}

                    </button>

                  );

                }
              )}

            </div>

          </div>


          {/* =================================================
              AI NOTICE
          ================================================= */}

          <div className="sidebar-ai-card">


            <div className="sidebar-ai-icon">

              <Sparkles
                size={17}
              />

            </div>


            <div>

              <strong>
                AI Evaluation
              </strong>


              <p>

                Your answers will be evaluated
                by Gemini after you complete
                the interview.

              </p>

            </div>

          </div>

        </aside>

      </main>


      {/* ===================================================
          SUBMIT CONFIRMATION MODAL
      =================================================== */}

      {showSubmitModal && (

        <div className="modal-overlay">


          <div className="submit-modal">


            <div className="modal-icon">

              <Send
                size={22}
              />

            </div>


            <h2>
              Submit your interview?
            </h2>


            <p>

              You have answered{" "}
              {answeredCount} of{" "}
              {questions.length} questions.

              {" "}

              Once submitted, your answers
              will be evaluated by AI.

            </p>


            <div className="modal-actions">


              <button
                className="modal-cancel"
                onClick={() =>
                  setShowSubmitModal(
                    false
                  )
                }
              >

                Continue Interview

              </button>


              <button
                className="modal-submit"
                disabled={
                  isEvaluating
                }
                onClick={
                  submitInterview
                }
              >

                Submit Interview

                <Send
                  size={15}
                />

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ===================================================
          AI EVALUATION LOADING
      =================================================== */}

      {isEvaluating && (

        <div className="modal-overlay">


          <div className="submit-modal">


            <div className="success-icon">

              <Sparkles
                size={28}
              />

            </div>


            <h2>

              AI is evaluating your interview

            </h2>


            <p>

              Gemini is analyzing your answers,
              technical knowledge, communication
              and role alignment.

            </p>


            <div className="loading-line"></div>

          </div>

        </div>

      )}


      {/* ===================================================
          SUCCESS OVERLAY
      =================================================== */}

      {submitted &&
        !isEvaluating && (

        <div className="modal-overlay">


          <div className="submit-modal">


            <div className="success-icon">

              <CheckCircle2
                size={28}
              />

            </div>


            <h2>

              Interview Submitted

            </h2>


            <p>

              Your answers have been evaluated.
              Preparing your personalized
              results...

            </p>


            <div className="loading-line"></div>

          </div>

        </div>

      )}


      {/* ===================================================
          EVALUATION ERROR
      =================================================== */}

      {evaluationError && (

        <div className="modal-overlay">


          <div className="submit-modal">


            <div
              className="modal-icon"
              style={{
                color: "#ff6b6b"
              }}
            >

              <AlertCircle
                size={24}
              />

            </div>


            <h2>

              Evaluation Failed

            </h2>


            <p>

              {evaluationError}

            </p>


            <div className="modal-actions">


              <button
                className="modal-cancel"
                onClick={() =>
                  setEvaluationError(
                    ""
                  )
                }
              >

                Continue Interview

              </button>


              <button
                className="modal-submit"
                onClick={
                  submitInterview
                }
              >

                Try Again

                <Send
                  size={15}
                />

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}


export default Interview;