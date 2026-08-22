import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  X,
  Sparkles,
  BriefcaseBusiness,
  UserRound,
  ClipboardList,
  Gauge,
  CheckCircle2
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function SetupInterview() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "Fresher",
    interviewType: "Mixed",
    difficulty: "Medium",
    questionCount: 10,
    jobDescription: ""
  });

  const [resume, setResume] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =====================================================
     AVAILABLE ROLES
  ===================================================== */

  const roles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Python Developer",
    "Java Developer",
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "AI Engineer"
  ];

  /* =====================================================
     EXPERIENCE LEVELS
  ===================================================== */

  const experiences = [
    "Fresher",
    "0–1 Years",
    "1–3 Years",
    "3–5 Years",
    "5+ Years"
  ];

  /* =====================================================
     INTERVIEW TYPES
  ===================================================== */

  const interviewTypes = [
    {
      value: "Technical",
      title: "Technical",
      description:
        "Programming, CS fundamentals & technical skills"
    },
    {
      value: "HR",
      title: "HR / Behavioral",
      description:
        "Communication, behavior & workplace scenarios"
    },
    {
      value: "Mixed",
      title: "Mixed Interview",
      description:
        "Technical + HR for a complete interview"
    }
  ];

  /* =====================================================
     DIFFICULTY LEVELS
  ===================================================== */

  const difficulties = [
    {
      value: "Easy",
      label: "Easy"
    },
    {
      value: "Medium",
      label: "Medium"
    },
    {
      value: "Hard",
      label: "Hard"
    }
  ];

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /* =====================================================
     RESUME VALIDATION
  ===================================================== */

  const handleResume = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF resume.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Resume must be smaller than 5 MB.");
      return;
    }

    setResume(file);
  };

  /* =====================================================
     FILE INPUT
  ===================================================== */

  const handleFileChange = (e) => {
    handleResume(e.target.files[0]);
  };

  /* =====================================================
     DRAG & DROP
  ===================================================== */

  const handleDrop = (e) => {
    e.preventDefault();

    setDragActive(false);

    const file = e.dataTransfer.files[0];

    handleResume(file);
  };

  /* =====================================================
     REMOVE RESUME
  ===================================================== */

  const removeResume = () => {
    setResume(null);
  };

  /* =====================================================
     GENERATE AI INTERVIEW
  ===================================================== */

  const handleGenerate = async () => {
    /* ---------------------------------------------------
       VALIDATION
    --------------------------------------------------- */

    if (!formData.role) {
      alert("Please select a target job role.");
      return;
    }

    if (!resume) {
      alert("Please upload your resume.");
      return;
    }

    if (!formData.jobDescription.trim()) {
      alert("Please enter the job description.");
      return;
    }

    setLoading(true);

    try {
      /* -------------------------------------------------
         CREATE MULTIPART FORM DATA
      ------------------------------------------------- */

      const form = new FormData();

      form.append("resume", resume);

      form.append(
        "role",
        formData.role
      );

      form.append(
        "experience",
        formData.experience
      );

      form.append(
        "interview_type",
        formData.interviewType
      );

      form.append(
        "difficulty",
        formData.difficulty
      );

      form.append(
        "question_count",
        String(formData.questionCount)
      );

      form.append(
        "job_description",
        formData.jobDescription
      );

      /* -------------------------------------------------
         SEND REQUEST TO FASTAPI
      ------------------------------------------------- */

     const response = await fetch(
  `${API_URL}/api/generate-interview`,
  {
    method: "POST",
    body: form
  }
);
      /* -------------------------------------------------
         READ RESPONSE
      ------------------------------------------------- */

      const data = await response.json();

      console.log(
        "InterviewAI Backend Response:",
        data
      );

      /* -------------------------------------------------
         HANDLE BACKEND ERROR
      ------------------------------------------------- */

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Failed to generate the AI interview."
        );
      }

      /* -------------------------------------------------
         VALIDATE AI RESPONSE
      ------------------------------------------------- */

      if (
        !data.success ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        throw new Error(
          "The AI did not return valid interview questions."
        );
      }

      /* -------------------------------------------------
         GO TO ACTUAL INTERVIEW SCREEN
      ------------------------------------------------- */

      navigate("/interview", {
        state: {
          role: formData.role,

          experience:
            formData.experience,

          interviewType:
            formData.interviewType,

          difficulty:
            formData.difficulty,

          questionCount:
            data.questions.length,

          jobDescription:
            formData.jobDescription,

          resumeName:
            resume.name,

          questions:
            data.questions
        }
      });

    } catch (error) {

      console.error(
        "Interview generation error:",
        error
      );

      alert(
        error.message ||
        "Something went wrong while generating the interview."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="setup-page">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="setup-glow setup-glow-one"></div>

      <div className="setup-glow setup-glow-two"></div>


      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="setup-navbar">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />

          Back to Home
        </button>


        <div className="setup-brand">

          <div className="brand-icon">

            <Brain size={20} />

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


        {/* STEP INDICATOR */}

        <div className="setup-progress">

          <span className="progress-active"></span>

          <span></span>

          <span></span>

        </div>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="setup-container">


        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <div className="setup-heading">

          <div className="setup-badge">

            <Sparkles size={14} />

            AI INTERVIEW SETUP

          </div>


          <h1>

            Build your

            <span>
              personalized interview.
            </span>

          </h1>


          <p>

            Tell us about the role you're targeting and
            upload your resume. Our AI will create an
            interview tailored specifically to you.

          </p>

        </div>


        {/* =================================================
            SETUP LAYOUT
        ================================================= */}

        <div className="setup-layout">


          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="setup-form">


            {/* =================================================
                TARGET ROLE
            ================================================= */}

            <section className="setup-card">

              <div className="card-heading">

                <div className="card-icon">

                  <BriefcaseBusiness size={19} />

                </div>


                <div>

                  <h2>
                    Target Role
                  </h2>

                  <p>
                    What position are you preparing for?
                  </p>

                </div>

              </div>


              <label>

                Job Role

                <span>
                  *
                </span>

              </label>


              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >

                <option value="">
                  Select your target role
                </option>


                {roles.map((role) => (

                  <option
                    key={role}
                    value={role}
                  >
                    {role}
                  </option>

                ))}

              </select>


              <label className="label-spaced">

                Experience Level

              </label>


              <div className="experience-grid">

                {experiences.map((experience) => (

                  <button
                    type="button"
                    key={experience}
                    className={
                      formData.experience === experience
                        ? "selection-button active"
                        : "selection-button"
                    }
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        experience
                      }))
                    }
                  >

                    <UserRound size={14} />

                    {experience}

                  </button>

                ))}

              </div>

            </section>


            {/* =================================================
                RESUME
            ================================================= */}

            <section className="setup-card">

              <div className="card-heading">

                <div className="card-icon">

                  <FileText size={19} />

                </div>


                <div>

                  <h2>
                    Your Resume
                  </h2>

                  <p>
                    Upload your latest resume for
                    personalized questions.
                  </p>

                </div>

              </div>


              {!resume ? (

                <div
                  className={
                    dragActive
                      ? "upload-box drag-active"
                      : "upload-box"
                  }

                  onDragOver={(e) => {

                    e.preventDefault();

                    setDragActive(true);

                  }}

                  onDragLeave={() =>
                    setDragActive(false)
                  }

                  onDrop={handleDrop}
                >

                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                  />


                  <label htmlFor="resume-upload">

                    <div className="upload-icon">

                      <Upload size={25} />

                    </div>


                    <strong>

                      Drop your resume here

                    </strong>


                    <span>

                      or{" "}

                      <u>
                        browse your files
                      </u>

                    </span>


                    <small>

                      PDF only • Maximum 5 MB

                    </small>

                  </label>

                </div>

              ) : (

                <div className="uploaded-file">


                  <div className="uploaded-file-left">

                    <div className="pdf-icon">

                      <FileText size={22} />

                    </div>


                    <div>

                      <strong>
                        {resume.name}
                      </strong>


                      <span>

                        {(resume.size / 1024 / 1024).toFixed(2)}
                        {" MB"}
                        {" • "}
                        PDF Resume

                      </span>

                    </div>

                  </div>


                  <button
                    type="button"
                    className="remove-file"
                    onClick={removeResume}
                  >

                    <X size={17} />

                  </button>

                </div>

              )}


              <div className="privacy-note">

                <CheckCircle2 size={14} />

                Your resume is used only to personalize
                your interview.

              </div>

            </section>


            {/* =================================================
                JOB DESCRIPTION
            ================================================= */}

            <section className="setup-card">

              <div className="card-heading">

                <div className="card-icon">

                  <ClipboardList size={19} />

                </div>


                <div>

                  <h2>
                    Job Description
                  </h2>

                  <p>
                    Paste the job description you're
                    applying for.
                  </p>

                </div>

              </div>


              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                placeholder={`Paste the job description here...

Example:
We are looking for a Software Engineer with experience in Python, React, REST APIs and SQL...`}
                rows="8"
              />


              <div className="character-count">

                {formData.jobDescription.length}
                {" characters"}

              </div>

            </section>

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <aside className="setup-sidebar">


            <section className="configuration-card">


              <div className="card-heading">

                <div className="card-icon">

                  <Gauge size={19} />

                </div>


                <div>

                  <h2>
                    Interview Settings
                  </h2>

                  <p>
                    Customize your practice session.
                  </p>

                </div>

              </div>


              {/* =================================================
                  INTERVIEW TYPE
              ================================================= */}

              <div className="setting-section">

                <label>
                  Interview Type
                </label>


                <div className="interview-types">

                  {interviewTypes.map((type) => (

                    <button
                      type="button"
                      key={type.value}
                      className={
                        formData.interviewType === type.value
                          ? "type-option active"
                          : "type-option"
                      }
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          interviewType: type.value
                        }))
                      }
                    >

                      <div className="type-radio">

                        {formData.interviewType === type.value && (
                          <div></div>
                        )}

                      </div>


                      <div>

                        <strong>
                          {type.title}
                        </strong>

                        <span>
                          {type.description}
                        </span>

                      </div>

                    </button>

                  ))}

                </div>

              </div>


              {/* =================================================
                  DIFFICULTY
              ================================================= */}

              <div className="setting-section">

                <label>
                  Difficulty
                </label>


                <div className="difficulty-buttons">

                  {difficulties.map((level) => (

                    <button
                      type="button"
                      key={level.value}
                      className={
                        formData.difficulty === level.value
                          ? "difficulty active"
                          : "difficulty"
                      }
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          difficulty: level.value
                        }))
                      }
                    >

                      {level.label}

                    </button>

                  ))}

                </div>

              </div>


              {/* =================================================
                  QUESTION COUNT
              ================================================= */}

              <div className="setting-section">

                <div className="question-heading">

                  <label>
                    Number of Questions
                  </label>


                  <strong>
                    {formData.questionCount}
                  </strong>

                </div>


                <input
                  type="range"
                  min="5"
                  max="20"
                  step="1"
                  value={formData.questionCount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      questionCount:
                        Number(e.target.value)
                    }))
                  }
                />


                <div className="range-labels">

                  <span>
                    5
                  </span>

                  <span>
                    20
                  </span>

                </div>

              </div>


              {/* =================================================
                  SUMMARY
              ================================================= */}

              <div className="setup-summary">


                <div>

                  <span>
                    Role
                  </span>

                  <strong>
                    {formData.role || "Not selected"}
                  </strong>

                </div>


                <div>

                  <span>
                    Experience
                  </span>

                  <strong>
                    {formData.experience}
                  </strong>

                </div>


                <div>

                  <span>
                    Interview
                  </span>

                  <strong>
                    {formData.interviewType}
                  </strong>

                </div>


                <div>

                  <span>
                    Difficulty
                  </span>

                  <strong>
                    {formData.difficulty}
                  </strong>

                </div>

              </div>


              {/* =================================================
                  GENERATE BUTTON
              ================================================= */}

              <button
                type="button"
                className="generate-button"
                onClick={handleGenerate}
                disabled={loading}
              >

                {loading ? (

                  <>

                    <span className="spinner"></span>

                    Creating Interview...

                  </>

                ) : (

                  <>

                    <Sparkles size={18} />

                    Generate AI Interview

                    <ArrowRight size={18} />

                  </>

                )}

              </button>


              <p className="generation-note">

                AI will analyze your resume and job
                description to create personalized questions.

              </p>

            </section>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default SetupInterview;