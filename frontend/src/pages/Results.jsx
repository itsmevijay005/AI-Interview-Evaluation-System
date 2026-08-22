import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  Brain,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Target,
  MessageCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp,
} from "lucide-react";


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

/*
  Converts values such as:
  84
  "84"
  "84/100"
  "84%"
  into a safe number.
*/
const getScore = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? Math.max(0, Math.min(100, value))
      : 0;
  }

  if (typeof value === "string") {
    const match = value.match(/\d+(\.\d+)?/);

    if (match) {
      const number = Number(match[0]);

      if (Number.isFinite(number)) {
        return Math.max(0, Math.min(100, number));
      }
    }
  }

  return 0;
};


/*
  Converts any value into a readable string.
*/
const getText = (value, fallback = "") => {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  if (typeof value === "string") {
    return value.trim() || fallback;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return fallback;
};


/*
  Safely converts arrays.
*/
const getArray = (value) => {
  return Array.isArray(value)
    ? value
    : [];
};


/*
  Convert an unknown value into readable
  feedback text.
*/
const getFeedbackText = (
  value,
  fallback
) => {

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .join(" ");
  }

  return fallback;
};


/*
  Converts strengths / improvement items
  into readable strings.
*/
const normalizeList = (value) => {

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {

      if (typeof item === "string") {
        return item.trim();
      }

      if (
        item &&
        typeof item === "object"
      ) {
        return (
          item.text ||
          item.point ||
          item.feedback ||
          item.description ||
          ""
        )
          .toString()
          .trim();
      }

      return "";
    })
    .filter(Boolean);
};


/* =========================================================
   RESULTS COMPONENT
   ========================================================= */

function Results() {

  const location = useLocation();
  const navigate = useNavigate();


  /* =======================================================
     STATE FROM INTERVIEW PAGE
  ======================================================= */

  const state = location.state || {};

  /*
    Sometimes data may be inside:
      state.evaluation

    Sometimes an API response may be nested:
      state.evaluation.data

    We support both.
  */

  const rawEvaluation =
    state.evaluation || {};


  const evaluation =
    rawEvaluation?.data &&
    typeof rawEvaluation.data === "object"
      ? rawEvaluation.data
      : rawEvaluation;


  const candidate =
    state.candidate || {};


  /* =======================================================
     INTERVIEW INFORMATION
  ======================================================= */

  const role =
    getText(
      state.role ||
      candidate.role ||
      candidate.target_role ||
      evaluation.role,
      "Software Engineer"
    );


  const experience =
    getText(
      state.experience ||
      candidate.experience ||
      candidate.experience_level ||
      evaluation.experience,
      "Fresher"
    );


  const interviewType =
    getText(
      state.interviewType ||
      state.interview_type ||
      candidate.interview_type ||
      evaluation.interview_type,
      "Mixed"
    );


  const difficulty =
    getText(
      state.difficulty ||
      candidate.difficulty ||
      evaluation.difficulty,
      "Medium"
    );


  /* =======================================================
     QUESTIONS
  ======================================================= */

  const questions = getArray(
    state.questions ||
    state.interviewQuestions ||
    evaluation.questions
  );


  /* =======================================================
     OVERALL SCORE
  ======================================================= */

  const overallScore = getScore(
    evaluation.overall_score ??
    evaluation.overallScore ??
    evaluation.total_score ??
    evaluation.totalScore ??
    evaluation.score
  );


  /* =======================================================
     CATEGORY SCORES
  ======================================================= */

  const categoryScores =
    evaluation.category_scores ||
    evaluation.categoryScores ||
    evaluation.scores ||
    {};


  const technicalScore = getScore(
    categoryScores.technical_skills ??
    categoryScores.technical ??
    categoryScores.technical_score
  );


  const communicationScore = getScore(
    categoryScores.communication ??
    categoryScores.communication_score
  );


  const problemSolvingScore = getScore(
    categoryScores.problem_solving ??
    categoryScores.problemSolving ??
    categoryScores.problem_solving_score
  );


  const roleAlignmentScore = getScore(
    categoryScores.role_alignment ??
    categoryScores.roleAlignment ??
    categoryScores.role_alignment_score
  );


  /* =======================================================
     PERFORMANCE LEVEL
  ======================================================= */

  const performanceLevel =
    getText(
      evaluation.performance_level ||
      evaluation.performanceLevel ||
      evaluation.result ||
      evaluation.rating,
      overallScore >= 90
        ? "Excellent"
        : overallScore >= 80
        ? "Very Good"
        : overallScore >= 70
        ? "Good"
        : overallScore >= 60
        ? "Needs Improvement"
        : "Needs More Preparation"
    );


  /* =======================================================
     AI SUMMARY
  ======================================================= */

  const summary =
    getText(
      evaluation.summary ||
      evaluation.overall_feedback ||
      evaluation.overallFeedback ||
      evaluation.feedback,
      "The AI evaluation has been completed. Review your scores and feedback below to understand your interview performance."
    );


  /* =======================================================
     STRENGTHS
  ======================================================= */

  const strengths = normalizeList(
    evaluation.strengths ||
    evaluation.key_strengths ||
    evaluation.keyStrengths
  );


  /* =======================================================
     AREAS TO IMPROVE
  ======================================================= */

  const areasToImprove = normalizeList(
    evaluation.areas_to_improve ||
    evaluation.areasToImprove ||
    evaluation.improvements ||
    evaluation.weaknesses
  );


  /* =======================================================
     RECOMMENDATION
  ======================================================= */

  const recommendation =
    getText(
      evaluation.recommendation ||
      evaluation.ai_recommendation ||
      evaluation.aiRecommendation ||
      evaluation.next_steps,
      "Continue practicing interview questions, strengthen your technical fundamentals, and focus on giving structured answers with clear examples."
    );


  /* =======================================================
     QUESTION EVALUATIONS
  ======================================================= */

  const questionEvaluations = getArray(
    evaluation.question_evaluations ||
    evaluation.questionEvaluations ||
    evaluation.evaluations ||
    evaluation.question_results ||
    evaluation.questionResults
  );


  /* =======================================================
     QUESTION EXPANSION
  ======================================================= */

  const [
    expandedQuestion,
    setExpandedQuestion
  ] = useState(null);


  /* =======================================================
     PERFORMANCE MESSAGE
  ======================================================= */

  const getPerformanceMessage = () => {

    if (overallScore >= 90) {
      return "Excellent interview performance";
    }

    if (overallScore >= 80) {
      return "Very strong interview performance";
    }

    if (overallScore >= 70) {
      return "Good interview performance";
    }

    if (overallScore >= 60) {
      return "Some areas need improvement";
    }

    return "More preparation is recommended";
  };


  /* =======================================================
     SCORE CLASS
  ======================================================= */

  const getScoreClass = (score) => {

    if (score >= 80) {
      return "score-good";
    }

    if (score >= 60) {
      return "score-average";
    }

    return "score-low";
  };


  /* =======================================================
     GET QUESTION TEXT
  ======================================================= */

  const getQuestionText = (
    questionItem,
    index
  ) => {

    if (typeof questionItem === "string") {
      return questionItem;
    }

    if (
      questionItem &&
      typeof questionItem === "object"
    ) {
      return (
        questionItem.question ||
        questionItem.text ||
        questionItem.question_text ||
        questionItem.prompt ||
        `Question ${index + 1}`
      );
    }

    return `Question ${index + 1}`;
  };


  /* =======================================================
     GET QUESTION TYPE
  ======================================================= */

  const getQuestionType = (
    questionItem
  ) => {

    if (
      questionItem &&
      typeof questionItem === "object"
    ) {
      return (
        questionItem.type ||
        questionItem.question_type ||
        questionItem.category ||
        "Interview Question"
      );
    }

    return "Interview Question";
  };


  /* =======================================================
     GET QUESTION SKILL
  ======================================================= */

  const getQuestionSkill = (
    questionItem
  ) => {

    if (
      questionItem &&
      typeof questionItem === "object"
    ) {
      return (
        questionItem.skill ||
        questionItem.topic ||
        questionItem.area ||
        ""
      );
    }

    return "";
  };


  /* =======================================================
     GET QUESTION EVALUATION
  ======================================================= */

  const getQuestionEvaluation = (
    index
  ) => {

    /*
      First try question number matching.
    */

    const numberedMatch =
      questionEvaluations.find(
        (item) =>
          Number(
            item?.question_number ??
            item?.questionNumber ??
            item?.number
          ) === index + 1
      );


    if (numberedMatch) {
      return numberedMatch;
    }


    /*
      Otherwise use same array position.
    */

    return (
      questionEvaluations[index] ||
      null
    );
  };


  /* =======================================================
     GET QUESTION SCORE
  ======================================================= */

  const getQuestionScore = (
    evaluationItem
  ) => {

    if (!evaluationItem) {
      return 0;
    }

    return getScore(
      evaluationItem.score ??
      evaluationItem.question_score ??
      evaluationItem.questionScore ??
      evaluationItem.rating ??
      evaluationItem.marks
    );
  };


  /* =======================================================
     GET QUESTION FEEDBACK
  ======================================================= */

  const getQuestionFeedback = (
    evaluationItem
  ) => {

    if (!evaluationItem) {
      return "No detailed evaluation was provided.";
    }

    return getFeedbackText(
      evaluationItem.evaluation ||
      evaluationItem.feedback ||
      evaluationItem.analysis ||
      evaluationItem.comments,
      "No detailed evaluation was provided."
    );
  };


  /* =======================================================
     GET WHAT WAS GOOD
  ======================================================= */

  const getWhatWasGood = (
    evaluationItem
  ) => {

    if (!evaluationItem) {
      return "No specific positive feedback was provided.";
    }

    return getFeedbackText(
      evaluationItem.what_was_good ||
      evaluationItem.whatWasGood ||
      evaluationItem.strengths ||
      evaluationItem.positive_feedback,
      "No specific positive feedback was provided."
    );
  };


  /* =======================================================
     GET WHAT TO IMPROVE
  ======================================================= */

  const getWhatToImprove = (
    evaluationItem
  ) => {

    if (!evaluationItem) {
      return "No specific improvement feedback was provided.";
    }

    return getFeedbackText(
      evaluationItem.what_to_improve ||
      evaluationItem.whatToImprove ||
      evaluationItem.improvements ||
      evaluationItem.weaknesses ||
      evaluationItem.negative_feedback,
      "No specific improvement feedback was provided."
    );
  };


  /* =======================================================
     GET IDEAL ANSWER POINTS
  ======================================================= */

  const getIdealAnswerPoints = (
    evaluationItem
  ) => {

    if (!evaluationItem) {
      return [];
    }

    return normalizeList(
      evaluationItem.ideal_answer_points ||
      evaluationItem.idealAnswerPoints ||
      evaluationItem.ideal_answer ||
      evaluationItem.key_points
    );
  };


  /* =======================================================
     TOGGLE QUESTION
  ======================================================= */

  const toggleQuestion = (
    index
  ) => {

    setExpandedQuestion(
      (previous) =>
        previous === index
          ? null
          : index
    );
  };


  /* =======================================================
     DYNAMIC SCORE RING
  ======================================================= */

  const scoreDegrees =
    overallScore * 3.6;


  /* =======================================================
     QUESTIONS TO DISPLAY
  ======================================================= */

  const displayQuestions =
    questions.length > 0
      ? questions
      : questionEvaluations;


  /* =======================================================
     NO EVALUATION FALLBACK
  ======================================================= */

  if (!state.evaluation) {

    return (
      <div className="results-page">

        {/* NAVBAR */}

        <header className="results-navbar">

          <button
            className="results-back-button"
            onClick={() =>
              navigate("/")
            }
          >

            <ArrowLeft size={16} />

            Back to Home

          </button>


          <div className="results-brand">

            <div className="results-brand-icon">

              <Brain size={19} />

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

        </header>


        {/* EMPTY STATE */}

        <main className="results-empty">

          <div className="results-empty-icon">

            <AlertTriangle size={30} />

          </div>


          <h1>
            No Evaluation Found
          </h1>


          <p>

            Your interview evaluation could
            not be found. Please complete
            an interview first.

          </p>


          <button
            className="results-primary-button"
            onClick={() =>
              navigate("/setup")
            }
          >

            Start Interview

            <ArrowLeft
              size={16}
              style={{
                transform:
                  "rotate(180deg)"
              }}
            />

          </button>

        </main>

      </div>
    );
  }


  /* =======================================================
     MAIN RESULTS PAGE
  ======================================================= */

  return (

    <div className="results-page">


      {/* ===================================================
          NAVBAR
      =================================================== */}

      <header className="results-navbar">


        <button
          className="results-back-button"
          onClick={() =>
            navigate("/")
          }
        >

          <ArrowLeft size={16} />

          Back to Home

        </button>


        <div className="results-brand">


          <div className="results-brand-icon">

            <Brain size={19} />

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


        <button
          className="results-new-button"
          onClick={() =>
            navigate("/setup")
          }
        >

          <RotateCcw size={15} />

          New Interview

        </button>

      </header>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="results-container">


        {/* =================================================
            HERO
        ================================================= */}

        <section className="results-hero">


          <div className="results-hero-icon">

            <Award size={28} />

          </div>


          <span className="results-eyebrow">

            AI INTERVIEW EVALUATION

          </span>


          <h1>

            Your interview{" "}

            <span>
              results.
            </span>

          </h1>


          <p>

            Here's a detailed analysis of your
            performance for the{" "}

            <strong>
              {role}
            </strong>{" "}

            position.

          </p>


          <div className="results-meta">


            <span>
              {experience}
            </span>


            <span>
              {interviewType}
            </span>


            <span>
              {difficulty}
            </span>


            <span>
              {displayQuestions.length} Questions
            </span>

          </div>

        </section>


        {/* =================================================
            SCORE OVERVIEW
        ================================================= */}

        <section className="score-overview">


          {/* OVERALL SCORE */}

          <div className="overall-score-card">


            <div
              className="score-ring"
              style={{
                background:
                  `conic-gradient(
                    #8463ff 0deg,
                    #a78bff ${scoreDegrees}deg,
                    rgba(255,255,255,0.06) ${scoreDegrees}deg,
                    rgba(255,255,255,0.06) 360deg
                  )`
              }}
            >


              <div className="score-ring-inner">

                <strong>
                  {overallScore}
                </strong>

                <span>
                  / 100
                </span>

              </div>

            </div>


            <div className="overall-score-content">


              <span className="card-eyebrow">

                OVERALL SCORE

              </span>


              <h2>
                {performanceLevel}
              </h2>


              <p>
                {getPerformanceMessage()}
              </p>

            </div>

          </div>


          {/* CATEGORY SCORES */}

          <div className="category-scores">


            {/* TECHNICAL */}

            <div className="category-card">


              <div className="category-icon">

                <Target size={18} />

              </div>


              <div className="category-content">


                <div className="category-heading">

                  <span>
                    Technical Skills
                  </span>

                  <strong>
                    {technicalScore}
                  </strong>

                </div>


                <div className="score-bar">

                  <div
                    style={{
                      width:
                        `${technicalScore}%`
                    }}
                  />

                </div>

              </div>

            </div>


            {/* COMMUNICATION */}

            <div className="category-card">


              <div className="category-icon">

                <MessageCircle size={18} />

              </div>


              <div className="category-content">


                <div className="category-heading">

                  <span>
                    Communication
                  </span>

                  <strong>
                    {communicationScore}
                  </strong>

                </div>


                <div className="score-bar">

                  <div
                    style={{
                      width:
                        `${communicationScore}%`
                    }}
                  />

                </div>

              </div>

            </div>


            {/* PROBLEM SOLVING */}

            <div className="category-card">


              <div className="category-icon">

                <Lightbulb size={18} />

              </div>


              <div className="category-content">


                <div className="category-heading">

                  <span>
                    Problem Solving
                  </span>

                  <strong>
                    {problemSolvingScore}
                  </strong>

                </div>


                <div className="score-bar">

                  <div
                    style={{
                      width:
                        `${problemSolvingScore}%`
                    }}
                  />

                </div>

              </div>

            </div>


            {/* ROLE ALIGNMENT */}

            <div className="category-card">


              <div className="category-icon">

                <TrendingUp size={18} />

              </div>


              <div className="category-content">


                <div className="category-heading">

                  <span>
                    Role Alignment
                  </span>

                  <strong>
                    {roleAlignmentScore}
                  </strong>

                </div>


                <div className="score-bar">

                  <div
                    style={{
                      width:
                        `${roleAlignmentScore}%`
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            AI SUMMARY
        ================================================= */}

        <section className="results-summary-card">


          <div className="section-icon">

            <Sparkles size={20} />

          </div>


          <div>

            <span className="card-eyebrow">

              AI PERFORMANCE SUMMARY

            </span>


            <h2>
              What the AI thinks
            </h2>


            <p>
              {summary}
            </p>

          </div>

        </section>


        {/* =================================================
            STRENGTHS + IMPROVEMENTS
        ================================================= */}

        <section className="feedback-grid">


          {/* STRENGTHS */}

          <div className="feedback-card strengths-card">


            <div className="feedback-header">


              <div className="feedback-icon success">

                <CheckCircle2 size={19} />

              </div>


              <div>

                <span className="card-eyebrow">

                  WHAT YOU DID WELL

                </span>


                <h2>
                  Key Strengths
                </h2>

              </div>

            </div>


            <div className="feedback-list">


              {strengths.length > 0 ? (

                strengths.map(
                  (strength, index) => (

                    <div
                      className="feedback-item"
                      key={index}
                    >

                      <CheckCircle2
                        size={15}
                      />

                      <span>
                        {strength}
                      </span>

                    </div>

                  )
                )

              ) : (

                <p className="empty-feedback">

                  No strengths were provided
                  by the AI evaluation.

                </p>

              )}

            </div>

          </div>


          {/* IMPROVEMENTS */}

          <div className="feedback-card improvement-card">


            <div className="feedback-header">


              <div className="feedback-icon warning">

                <AlertTriangle size={19} />

              </div>


              <div>

                <span className="card-eyebrow">

                  NEXT STEPS

                </span>


                <h2>
                  Areas to Improve
                </h2>

              </div>

            </div>


            <div className="feedback-list">


              {areasToImprove.length > 0 ? (

                areasToImprove.map(
                  (item, index) => (

                    <div
                      className="feedback-item"
                      key={index}
                    >

                      <AlertTriangle
                        size={15}
                      />

                      <span>
                        {item}
                      </span>

                    </div>

                  )
                )

              ) : (

                <p className="empty-feedback">

                  No improvement areas were
                  provided by the AI evaluation.

                </p>

              )}

            </div>

          </div>

        </section>


        {/* =================================================
            AI RECOMMENDATION
        ================================================= */}

        <section className="recommendation-card">


          <div className="recommendation-icon">

            <Sparkles size={22} />

          </div>


          <div>


            <span className="card-eyebrow">

              AI CAREER COACH

            </span>


            <h2>
              Personalized Recommendation
            </h2>


            <p>
              {recommendation}
            </p>

          </div>

        </section>


        {/* =================================================
            QUESTION-BY-QUESTION EVALUATION
        ================================================= */}

        <section className="question-results-section">


          <div className="section-heading">


            <div>

              <span className="card-eyebrow">

                DETAILED BREAKDOWN

              </span>


              <h2>
                Question-by-Question Evaluation
              </h2>


              <p>

                Review how the AI evaluated
                each of your answers.

              </p>

            </div>


            <div className="question-count">

              {displayQuestions.length}

              {" Questions"}

            </div>

          </div>


          <div className="question-results-list">


            {displayQuestions.length > 0 ? (

              displayQuestions.map(
                (questionItem, index) => {


                  const evaluationItem =
                    getQuestionEvaluation(
                      index
                    );


                  const score =
                    getQuestionScore(
                      evaluationItem
                    );


                  const questionText =
                    getQuestionText(
                      questionItem,
                      index
                    );


                  const questionType =
                    getQuestionType(
                      questionItem
                    );


                  const questionSkill =
                    getQuestionSkill(
                      questionItem
                    );


                  const isExpanded =
                    expandedQuestion ===
                    index;


                  const feedback =
                    getQuestionFeedback(
                      evaluationItem
                    );


                  const whatWasGood =
                    getWhatWasGood(
                      evaluationItem
                    );


                  const whatToImprove =
                    getWhatToImprove(
                      evaluationItem
                    );


                  const idealAnswerPoints =
                    getIdealAnswerPoints(
                      evaluationItem
                    );


                  return (

                    <div
                      className={
                        isExpanded
                          ? "question-result expanded"
                          : "question-result"
                      }
                      key={index}
                    >


                      {/* QUESTION HEADER */}

                      <button
                        type="button"
                        className="question-result-header"
                        onClick={() =>
                          toggleQuestion(
                            index
                          )
                        }
                      >


                        <div className="question-result-number">

                          Q
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}

                        </div>


                        <div className="question-result-main">


                          <div className="question-result-meta">


                            <span>

                              {questionType}

                            </span>


                            {questionSkill && (

                              <span>

                                {questionSkill}

                              </span>

                            )}

                          </div>


                          <h3>
                            {questionText}
                          </h3>

                        </div>


                        <div className="question-result-score">


                          <strong
                            className={
                              getScoreClass(
                                score
                              )
                            }
                          >

                            {score}

                          </strong>


                          <span>
                            /100
                          </span>


                          {isExpanded ? (

                            <ChevronUp
                              size={17}
                            />

                          ) : (

                            <ChevronDown
                              size={17}
                            />

                          )}

                        </div>

                      </button>


                      {/* EXPANDED DETAILS */}

                      {isExpanded && (

                        <div className="question-result-details">


                          {/* AI EVALUATION */}

                          <div className="evaluation-detail">


                            <span>
                              AI Evaluation
                            </span>


                            <p>
                              {feedback}
                            </p>

                          </div>


                          {/* POSITIVE + IMPROVEMENT */}

                          <div className="evaluation-columns">


                            <div className="evaluation-positive">


                              <div className="detail-heading">

                                <CheckCircle2
                                  size={15}
                                />

                                What was good

                              </div>


                              <p>
                                {whatWasGood}
                              </p>

                            </div>


                            <div className="evaluation-warning">


                              <div className="detail-heading">

                                <AlertTriangle
                                  size={15}
                                />

                                What to improve

                              </div>


                              <p>
                                {whatToImprove}
                              </p>

                            </div>

                          </div>


                          {/* IDEAL ANSWER */}

                          {idealAnswerPoints.length > 0 && (

                            <div className="ideal-answer">


                              <div className="detail-heading">

                                <Lightbulb
                                  size={15}
                                />

                                Ideal Answer Points

                              </div>


                              <ul>

                                {idealAnswerPoints.map(
                                  (
                                    point,
                                    pointIndex
                                  ) => (

                                    <li
                                      key={
                                        pointIndex
                                      }
                                    >

                                      {point}

                                    </li>

                                  )
                                )}

                              </ul>

                            </div>

                          )}

                        </div>

                      )}

                    </div>

                  );
                }
              )

            ) : (

              <div className="no-question-results">

                <AlertTriangle
                  size={20}
                />

                <p>

                  Detailed question evaluations
                  are not available for this interview.

                </p>

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            FINAL CTA
        ================================================= */}

        <section className="results-final-cta">


          <div>


            <Sparkles size={22} />


            <div>

              <h2>
                Ready to improve your score?
              </h2>


              <p>

                Practice another personalized
                interview and track your progress.

              </p>

            </div>

          </div>


          <button
            type="button"
            className="results-primary-button"
            onClick={() =>
              navigate("/setup")
            }
          >

            Start New Interview

            <RotateCcw size={16} />

          </button>

        </section>


      </main>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="results-footer">


        <div className="results-footer-brand">


          <div className="results-brand-icon">

            <Brain size={17} />

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


        <p>
          Practice smarter. Interview better.
        </p>


        <span>
          © 2026 InterviewAI
        </span>

      </footer>

    </div>
  );
}


export default Results;