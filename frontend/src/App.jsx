import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import {
  Brain,
  Sparkles,
  ArrowRight,
  FileText,
  Target,
  BarChart3,
  MessageSquare,
  History,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Play
} from "lucide-react";

import "./index.css";

import SetupInterview from "./pages/SetupInterview";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import HistoryPage from "./pages/History";


/* ================================================= */
/* HOME PAGE */
/* ================================================= */

function Home() {

  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Resume-Based Questions",
      description:
        "AI analyzes your resume and generates interview questions based on your actual skills, projects and experience."
    },
    {
      icon: Target,
      title: "Role-Specific Interviews",
      description:
        "Practice interviews tailored to your target role, job description and required technical skills."
    },
    {
      icon: MessageSquare,
      title: "AI Answer Evaluation",
      description:
        "Get intelligent evaluation of every answer with scores, strengths, weaknesses and actionable feedback."
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Understand your interview performance through detailed scores and personalized improvement insights."
    },
    {
      icon: History,
      title: "Interview History",
      description:
        "Track previous interviews, scores and feedback so you can measure your improvement over time."
    },
    {
      icon: Sparkles,
      title: "Smart Recommendations",
      description:
        "Receive AI-powered recommendations to improve your technical knowledge and communication."
    }
  ];

  return (
    <div className="app">

      {/* ========================= */}
      {/* BACKGROUND EFFECTS */}
      {/* ========================= */}

      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>


      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-icon">
            <Brain size={22} />
          </div>

          <div>
            <span className="brand-name">
              InterviewAI
            </span>

            <span className="brand-subtitle">
              AI Interview Coach
            </span>
          </div>

        </div>


        <nav className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#about">
            About
          </a>

        </nav>


        {/* START INTERVIEW */}

        <button
          className="nav-button"
          onClick={() => navigate("/setup")}
        >
          Start Interview

          <ArrowRight size={16} />

        </button>

      </header>


      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      <main id="home">

        <section className="hero-section">

          <div className="hero-content">

            <div className="hero-badge">

              <span className="badge-dot"></span>

              <Sparkles size={15} />

              Powered by Artificial Intelligence

            </div>


            <h1>

              Master Your Next

              <span>
                Interview.
              </span>

            </h1>


            <p className="hero-description">

              Practice smarter with AI-powered mock interviews.
              Get personalized questions from your resume,
              real-time evaluation and actionable feedback
              to become interview-ready.

            </p>


            <div className="hero-actions">

              <button
                className="primary-button"
                onClick={() => navigate("/setup")}
              >

                <Play
                  size={18}
                  fill="currentColor"
                />

                Start Mock Interview

                <ArrowRight size={18} />

              </button>


              <button
                className="secondary-button"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({
                      behavior: "smooth"
                    })
                }
              >

                Explore Features

              </button>

            </div>


            {/* TRUST ROW */}

            <div className="trust-row">

              <div>

                <CheckCircle2 size={17} />

                <span>
                  Resume-Based
                </span>

              </div>


              <div>

                <CheckCircle2 size={17} />

                <span>
                  AI Evaluation
                </span>

              </div>


              <div>

                <CheckCircle2 size={17} />

                <span>
                  Instant Feedback
                </span>

              </div>

            </div>

          </div>


          {/* ========================= */}
          {/* HERO DASHBOARD PREVIEW */}
          {/* ========================= */}

          <div className="hero-visual">

            <div className="dashboard-window">

              <div className="window-header">

                <div className="window-dots">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

                <span className="window-title">
                  Interview Performance
                </span>

              </div>


              <div className="dashboard-content">

                <div className="dashboard-top">

                  <div>

                    <span className="small-label">
                      Overall Score
                    </span>


                    <div className="big-score">

                      8.7

                      <span>
                        /10
                      </span>

                    </div>


                    <div className="positive">

                      <ArrowRight size={14} />

                      Excellent performance

                    </div>

                  </div>


                  <div className="score-ring">

                    <div>

                      <strong>
                        87%
                      </strong>

                      <span>
                        Score
                      </span>

                    </div>

                  </div>

                </div>


                {/* SCORE BARS */}

                <div className="score-bars">

                  <div className="score-item">

                    <div>

                      <span>
                        Technical Skills
                      </span>

                      <strong>
                        9.0
                      </strong>

                    </div>


                    <div className="progress">

                      <div
                        style={{
                          width: "90%"
                        }}
                      ></div>

                    </div>

                  </div>


                  <div className="score-item">

                    <div>

                      <span>
                        Communication
                      </span>

                      <strong>
                        8.5
                      </strong>

                    </div>


                    <div className="progress">

                      <div
                        style={{
                          width: "85%"
                        }}
                      ></div>

                    </div>

                  </div>


                  <div className="score-item">

                    <div>

                      <span>
                        Problem Solving
                      </span>

                      <strong>
                        8.6
                      </strong>

                    </div>


                    <div className="progress">

                      <div
                        style={{
                          width: "86%"
                        }}
                      ></div>

                    </div>

                  </div>

                </div>


                {/* AI FEEDBACK */}

                <div className="ai-feedback">

                  <div className="feedback-icon">

                    <Sparkles size={17} />

                  </div>


                  <div>

                    <strong>
                      AI Feedback
                    </strong>

                    <p>
                      Strong technical understanding.
                      Improve answer structure and clarity.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* FLOATING CARD */}

            <div className="floating-card floating-top">

              <Brain size={17} />

              <span>
                AI Analysis
              </span>

              <strong>
                Active
              </strong>

            </div>


            {/* Personalized Feedback card intentionally removed */}

          </div>

        </section>


        {/* ========================= */}
        {/* STATS */}
        {/* ========================= */}

        <section className="stats-section">

          <div className="stat">

            <strong>
              AI
            </strong>

            <span>
              Powered Evaluation
            </span>

          </div>


          <div className="stat">

            <strong>
              10+
            </strong>

            <span>
              Question Types
            </span>

          </div>


          <div className="stat">

            <strong>
              360°
            </strong>

            <span>
              Performance Analysis
            </span>

          </div>


          <div className="stat">

            <strong>
              Instant
            </strong>

            <span>
              Personalized Feedback
            </span>

          </div>

        </section>


        {/* ========================= */}
        {/* FEATURES */}
        {/* ========================= */}

        <section
          className="features-section"
          id="features"
        >

          <div className="section-heading">

            <div className="section-label">

              <Zap size={15} />

              POWERFUL FEATURES

            </div>


            <h2>

              Everything you need to

              <span>
                ace your interview.
              </span>

            </h2>


            <p>

              One intelligent platform to practice,
              evaluate and continuously improve your
              interview performance.

            </p>

          </div>


          <div className="feature-grid">

            {features.map((feature, index) => {

              const Icon = feature.icon;

              return (

                <div
                  className="feature-card"
                  key={index}
                >

                  <div className="feature-icon">

                    <Icon size={22} />

                  </div>


                  <h3>
                    {feature.title}
                  </h3>


                  <p>
                    {feature.description}
                  </p>


                  <button
                    onClick={() =>
                      document
                        .getElementById("how-it-works")
                        ?.scrollIntoView({
                          behavior: "smooth"
                        })
                    }
                  >

                    Learn more

                    <ArrowRight size={15} />

                  </button>

                </div>

              );

            })}

          </div>

        </section>


        {/* ========================= */}
        {/* HOW IT WORKS */}
        {/* ========================= */}

        <section
          className="how-section"
          id="how-it-works"
        >

          <div className="section-heading">

            <div className="section-label">

              <Brain size={15} />

              HOW IT WORKS

            </div>


            <h2>

              Your interview preparation,

              <span>
                simplified.
              </span>

            </h2>


            <p>

              Start practicing in minutes with a simple
              AI-powered interview workflow.

            </p>

          </div>


          <div className="steps">

            <div className="step">

              <div className="step-number">
                01
              </div>

              <div>

                <h3>
                  Upload Your Resume
                </h3>

                <p>
                  Upload your resume and optionally provide
                  the job description you're targeting.
                </p>

              </div>

            </div>


            <div className="step">

              <div className="step-number">
                02
              </div>

              <div>

                <h3>
                  Generate Your Interview
                </h3>

                <p>
                  AI creates personalized technical and
                  HR questions based on your profile.
                </p>

              </div>

            </div>


            <div className="step">

              <div className="step-number">
                03
              </div>

              <div>

                <h3>
                  Answer & Get Evaluated
                </h3>

                <p>
                  Answer each question and receive AI-powered
                  scoring and detailed feedback.
                </p>

              </div>

            </div>


            <div className="step">

              <div className="step-number">
                04
              </div>

              <div>

                <h3>
                  Improve & Repeat
                </h3>

                <p>
                  Review your weaknesses and practice again
                  to continuously improve your performance.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ========================= */}
        {/* CTA */}
        {/* ========================= */}

        <section className="cta-section">

          <div className="cta-content">

            <div className="cta-icon">

              <Sparkles size={26} />

            </div>


            <h2>

              Your next interview

              <span>
                starts here.
              </span>

            </h2>


            <p>

              Stop guessing what interviewers will ask.
              Start practicing with AI.

            </p>


            <button
              className="primary-button"
              onClick={() => navigate("/setup")}
            >

              Start Your AI Interview

              <ArrowRight size={18} />

            </button>

          </div>

        </section>

      </main>


      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}

      <footer
        className="site-footer"
        id="about"
      >

        <div className="footer-main">


          {/* BRAND */}

          <div className="footer-brand-section">

            <div className="footer-brand">

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


            <p>

              AI-powered interview preparation and evaluation
              designed to help you practice smarter and
              interview with confidence.

            </p>

          </div>


          {/* PRODUCT */}

          <div className="footer-column">

            <h4>
              Product
            </h4>

            <a href="#features">
              Features
            </a>

            <a href="#how-it-works">
              How It Works
            </a>

            <button
              className="footer-link-button"
              onClick={() => navigate("/setup")}
            >
              AI Interview
            </button>

            <a href="#features">
              Evaluation
            </a>

          </div>


          {/* RESOURCES */}

          <div className="footer-column">

            <h4>
              Resources
            </h4>

            <a href="#home">
              Interview Tips
            </a>

            <a href="#home">
              Practice Questions
            </a>

            <a href="#home">
              Career Preparation
            </a>

            <a href="#home">
              Performance Guide
            </a>

          </div>


          {/* PLATFORM */}

          <div className="footer-column">

            <h4>
              Platform
            </h4>

            <a href="#features">
              Resume Analysis
            </a>

            <a href="#features">
              AI Evaluation
            </a>

            <button
              className="footer-link-button"
              onClick={() => navigate("/history")}
            >
              Interview History
            </button>

            <a href="#features">
              Analytics
            </a>

          </div>

        </div>


        {/* FOOTER BOTTOM */}

        <div className="footer-bottom">

          <span>
            © 2026 InterviewAI. All rights reserved.
          </span>


          <div className="footer-status">

            <span className="status-dot"></span>

            AI Interview Platform

          </div>


          <span>
            Built with React & AI
          </span>

        </div>

      </footer>

    </div>
  );
}


/* ================================================= */
/* MAIN APP / ROUTES */
/* ================================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* INTERVIEW SETUP */}

        <Route
          path="/setup"
          element={<SetupInterview />}
        />


        {/* INTERVIEW */}

        <Route
          path="/interview"
          element={<Interview />}
        />


        {/* RESULTS */}

        <Route
          path="/results"
          element={<Results />}
        />


        {/* HISTORY */}

        <Route
          path="/history"
          element={<HistoryPage />}
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;