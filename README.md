# 🤖 AI Interview Evaluation System

<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered-8B5CF6?style=for-the-badge" alt="AI Powered"/>
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React + Vite"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini"/>
  <img src="https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel" alt="Vercel"/>
  <img src="https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render"/>
</p>

<h3 align="center">
  AI-Powered Mock Interview Preparation & Evaluation Platform
</h3>

<p align="center">
  A personalized AI interview platform that generates interview questions
  from a candidate's resume and target job description, evaluates answers,
  and provides actionable performance feedback.
</p>

<p align="center">
  <a href="https://ai-interview-evaluation-system.vercel.app">
    <strong>🚀 Live Demo</strong>
  </a>
  &nbsp; • &nbsp;
  <a href="https://github.com/itsmevijay005/AI-Interview-Evaluation-System">
    <strong>💻 GitHub Repository</strong>
  </a>
  &nbsp; • &nbsp;
  <a href="https://ai-interview-evaluation-system.onrender.com/docs">
    <strong>📚 API Documentation</strong>
  </a>
</p>

---

## 📖 Overview

**AI Interview Evaluation System** is a full-stack Generative AI application designed to help students, freshers, and job seekers practice interviews in a personalized environment.

Unlike traditional interview preparation platforms that rely on static question banks, this system dynamically generates questions based on the candidate's:

* 📄 Resume
* 💼 Target job description
* 🎯 Target role
* 👨‍💻 Experience level
* 🗣️ Interview type
* ⚡ Difficulty level
* 🧩 Technical and situational requirements

The platform uses **Google Gemini AI** to generate relevant interview questions and evaluate candidate answers.

After completing the interview, the system provides structured performance feedback including:

* Overall score
* Category-wise scores
* Performance level
* Strengths
* Areas for improvement
* Personalized recommendations
* Question-by-question evaluation

---

# 🎯 Problem Statement

Traditional interview preparation platforms often provide generic or predefined questions that do not consider the candidate's actual skills, projects, experience, or target job.

This project solves that problem by creating an **AI-driven personalized interview workflow**.

The system analyzes the candidate's resume and target role requirements to create a customized mock interview experience.

### The system is designed to:

* Analyze candidate resumes
* Understand target job requirements
* Generate technical questions
* Generate HR and behavioral questions
* Generate situational questions
* Adapt questions according to difficulty
* Evaluate candidate responses
* Identify strengths and weaknesses
* Provide actionable improvement feedback

---

# ✨ Key Features

## 📄 1. Resume-Based Interview

Candidates can provide their resume and receive questions based on information such as:

* Technical skills
* Projects
* Internships
* Education
* Certifications
* Work experience
* Programming languages
* Tools and technologies

This makes the interview more relevant to the candidate's actual profile.

---

## 💼 2. Job-Specific Interview

Candidates can provide a target job description.

The AI uses the job requirements to generate questions relevant to the desired position.

### Example

```text
Role            : Software Engineer
Experience      : Fresher
Interview Type  : Mixed
Difficulty      : Medium
Question Count  : 5
```

---

## 🧑‍💻 3. Technical Questions

The system can generate technical questions based on:

* Programming
* Data Structures
* Algorithms
* Databases
* Web Development
* APIs
* Software Engineering
* Candidate-specific technologies

Questions can be adapted according to the candidate's resume and target role.

---

## 🧠 4. Situational Questions

The system can generate scenario-based questions designed to evaluate how candidates handle real-world situations.

### Examples

```text
• How would you handle a production bug immediately before deployment?

• What would you do if a teammate disagreed with your technical approach?

• How would you prioritize multiple tasks with the same deadline?

• What would you do if you discovered an error in your implementation
  after submitting the project?
```

These questions help evaluate:

* Decision-making
* Problem-solving
* Communication
* Teamwork
* Leadership
* Adaptability
* Professional judgment

---

## 🤝 5. HR & Behavioral Questions

The platform can generate questions related to:

* Introduction
* Strengths and weaknesses
* Career goals
* Teamwork
* Conflict resolution
* Leadership
* Communication
* Motivation
* Internship experience
* Project experience

---

## ⚡ 6. Difficulty-Based Interviews

The candidate can select an interview difficulty level.

### Supported Levels

```text
Easy
Medium
Hard
```

The AI adjusts the complexity of generated questions according to the selected level.

---

## 🗣️ 7. Multiple Interview Types

The system supports different interview styles, including:

```text
Technical
HR / Behavioral
Mixed
Situational
```

A mixed interview can combine technical, behavioral, and situational questions.

---

## ⏱️ 8. Interactive Interview Experience

The interview interface provides:

* Question display
* Answer input
* Timer
* Progress tracking
* Question navigation
* Interview submission

This creates a realistic mock interview environment.

---

## 🤖 9. AI-Powered Answer Evaluation

After submitting the interview, Google Gemini evaluates the candidate's responses.

The evaluation considers:

* Technical correctness
* Communication
* Problem-solving
* Role alignment
* Answer quality
* Completeness

---

## 📊 10. Performance Analysis

The results page provides:

* Overall score
* Category scores
* Performance level
* Strengths
* Areas to improve
* Recommendations
* Individual question evaluations

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────────────────────────────┐
│                         USER / CANDIDATE                       │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                           VERCEL                              │
│                                                               │
│                     React + Vite Frontend                     │
│                                                               │
│        https://ai-interview-evaluation-system.vercel.app      │
└───────────────────────────────┬───────────────────────────────┘
                                │
                              HTTPS
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                           RENDER                              │
│                                                               │
│                      FastAPI Backend                           │
│                                                               │
│        https://ai-interview-evaluation-system.onrender.com     │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                       GOOGLE GEMINI AI                         │
│                                                               │
│  • Resume Understanding                                       │
│  • Question Generation                                        │
│  • Technical Questions                                        │
│  • Situational Questions                                      │
│  • HR / Behavioral Questions                                   │
│  • Answer Evaluation                                          │
│  • Performance Analysis                                       │
│  • Personalized Feedback                                      │
└───────────────────────────────────────────────────────────────┘
```

---

# 🔄 Complete Application Workflow

```text
                         ┌───────────────┐
                         │     USER      │
                         └───────┬───────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │       HOME PAGE        │
                    │                        │
                    │   Start Interview      │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │    INTERVIEW SETUP     │
                    │                        │
                    │ • Resume               │
                    │ • Job Description      │
                    │ • Target Role          │
                    │ • Experience           │
                    │ • Interview Type       │
                    │ • Difficulty           │
                    │ • Question Count       │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │     FASTAPI BACKEND    │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │   RESUME PROCESSING    │
                    │         PyPDF          │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │    GOOGLE GEMINI AI    │
                    │                        │
                    │  Question Generation   │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │    INTERVIEW PAGE      │
                    │                        │
                    │ • Questions            │
                    │ • Answers              │
                    │ • Timer                │
                    │ • Progress             │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │   SUBMIT INTERVIEW     │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │    GOOGLE GEMINI AI    │
                    │                        │
                    │    Answer Evaluation   │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │      RESULTS PAGE      │
                    │                        │
                    │ • Overall Score        │
                    │ • Category Scores      │
                    │ • Strengths            │
                    │ • Improvements         │
                    │ • Recommendation       │
                    │ • Question Evaluation  │
                    └────────────────────────┘
```

---

# 🧩 Interview Generation Flow

```text
Resume
   │
   ▼
Resume Text Extraction
   │
   ▼
Candidate Profile
   │
   ├───────────────┐
   │               │
   ▼               ▼
Job Description   Target Role
   │               │
   └───────┬───────┘
           │
           ▼
   Interview Configuration
           │
           ├── Experience Level
           ├── Interview Type
           ├── Difficulty
           └── Question Count
           │
           ▼
      Google Gemini
           │
           ▼
   Personalized Questions
           │
           ▼
    Candidate Interview
```

---

# 🧠 AI Evaluation Flow

```text
Candidate Answers
        │
        ▼
   FastAPI Backend
        │
        ▼
   Google Gemini AI
        │
        ├── Technical Skills
        ├── Communication
        ├── Problem Solving
        └── Role Alignment
        │
        ▼
Structured Evaluation
        │
        ▼
Results Dashboard
```

---

# 🛠️ Technology Stack

| Category             | Technology            |
| -------------------- | --------------------- |
| Frontend             | React                 |
| Build Tool           | Vite                  |
| Backend              | FastAPI               |
| Programming Language | Python                |
| AI Model             | Google Gemini         |
| Resume Processing    | PyPDF                 |
| API Communication    | REST API              |
| API Documentation    | Swagger / ReDoc       |
| Frontend Deployment  | Vercel                |
| Backend Deployment   | Render                |
| Version Control      | Git                   |
| Repository Hosting   | GitHub                |
| Configuration        | Environment Variables |

---

# 📁 Project Structure

```text
AI-Interview-Evaluation-System/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── ...
│
├── .gitignore
└── README.md
```

> The exact component/file names may vary depending on the current implementation. Keep this section synchronized with the repository if the structure changes.

---

# ⚙️ Local Installation

## 1. Clone the Repository

```bash
git clone https://github.com/itsmevijay005/AI-Interview-Evaluation-System.git
```

---

## 2. Navigate to the Project

```bash
cd AI-Interview-Evaluation-System
```

---

# 🎨 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a frontend environment file if required by the implementation:

```text
.env
```

Configure the backend API URL according to your local environment.

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🐍 Backend Setup

Open a new terminal and navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Activate on Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🔐 Environment Variables

The Gemini API key must be stored securely using environment variables.

Create:

```text
backend/.env
```

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
```

> Never commit your real API key to GitHub.

Make sure `.env` is included in `.gitignore`.

---

# ▶️ Start the Backend

Run the FastAPI application using:

```bash
uvicorn main:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

ReDoc:

```text
http://127.0.0.1:8000/redoc
```

---

# 📚 API Documentation

The production backend provides interactive API documentation through FastAPI.

### Swagger

https://ai-interview-evaluation-system.onrender.com/docs

### ReDoc

https://ai-interview-evaluation-system.onrender.com/redoc

Swagger can be used to inspect and test the backend API endpoints.

---

# 📊 Example Interview Configuration

```text
Role:
Software Engineer

Experience:
Fresher

Interview Type:
Mixed

Difficulty:
Medium

Question Count:
5
```

### Example Job Description

```text
Software Engineer role requiring programming,
problem-solving, web development and API skills.
```

The AI generates questions based on the supplied:

```text
Resume
+
Job Description
+
Target Role
+
Experience Level
+
Interview Type
+
Difficulty
```

---

# 🧠 AI Evaluation Structure

The backend requests a structured AI evaluation similar to:

```json
{
  "overall_score": 82,
  "category_scores": {
    "technical_skills": 85,
    "communication": 78,
    "problem_solving": 84,
    "role_alignment": 81
  },
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
  "recommendation": "Candidate should continue practicing technical and behavioral questions.",
  "question_evaluations": [
    {
      "question_number": 1,
      "score": 85,
      "evaluation": "Brief evaluation of the candidate's answer.",
      "what_was_good": "What the candidate did well.",
      "what_to_improve": "What could be improved.",
      "ideal_answer_points": [
        "Important point one",
        "Important point two"
      ]
    }
  ]
}
```

---

# 📈 Performance Levels

|  Score | Performance Level             |
| -----: | ----------------------------- |
| 90–100 | Excellent                     |
|  80–89 | Very Good                     |
|  70–79 | Good                          |
|  60–69 | Needs Improvement             |
|   0–59 | Needs Significant Improvement |

---

# 🔐 Security

The project follows basic security practices:

* 🔐 API keys are stored using environment variables
* 🚫 `.env` files are excluded from Git
* 🔑 Gemini credentials are not exposed in frontend code
* 🛡️ AI communication is handled by the backend
* 🔒 HTTPS is used in production
* 🌐 Frontend and backend are deployed separately
* 🚫 Sensitive credentials are not hard-coded
* ⚙️ Environment-specific configuration is used

---

# 🧪 Testing

The application was tested across the complete interview workflow.

### Frontend

* Home Page
* Interview Setup
* Resume Upload
* Job Description
* Interview Configuration
* Interview Generation
* Question Display
* Answer Input
* Question Navigation
* Progress Tracking
* Interview Submission
* Results Display

### Backend

* FastAPI application
* REST API communication
* Resume processing
* Gemini integration
* AI question generation
* AI answer evaluation
* Swagger documentation
* ReDoc documentation

### Production

```text
Vercel
   │
   ▼
Render
   │
   ▼
Google Gemini
```

The production frontend-backend communication was verified through the deployed application.

---

# 🚫 Current Scope

The current version focuses on the **core AI interview preparation and evaluation workflow**.

The following features are intentionally outside the current implementation:

* Persistent interview history
* Database-backed user accounts
* Downloadable PDF evaluation reports
* Advanced analytics dashboard
* Voice-based interviews
* Speech-to-text interaction

These features are planned as future enhancements.

---

# 🚀 Future Enhancements

* [ ] User Authentication
* [ ] Database Integration
* [ ] Persistent Interview History
* [ ] Downloadable PDF Performance Reports
* [ ] Voice-Based Interview Mode
* [ ] Speech-to-Text
* [ ] Real-Time AI Interviewer
* [ ] Advanced Performance Analytics
* [ ] Resume Skill-Gap Analysis
* [ ] Job Recommendation System
* [ ] Multiple AI Model Support
* [ ] Interview Progress Tracking
* [ ] Personalized Interview Preparation Plans
* [ ] Interview Performance Dashboard
* [ ] Role-Specific Interview Templates

---

# 🧠 Key Learning Outcomes

This project provided practical experience in:

* Full-stack application development
* React component development
* Vite frontend development
* FastAPI backend development
* Python development
* REST API integration
* Generative AI integration
* Google Gemini API
* Prompt engineering
* Resume/PDF processing
* Frontend-backend communication
* Environment variable management
* Git and GitHub
* Git branching and commits
* API testing
* Swagger documentation
* Production deployment
* Vercel deployment
* Render deployment
* Debugging deployed applications
* Building AI-powered applications

---

# 💼 Resume Project Description

### AI Interview Evaluation System

> Developed a full-stack AI-powered interview preparation platform using React, Vite, FastAPI, Python, and Google Gemini. Implemented resume-based and job-specific interview question generation, including technical, HR, behavioral, and situational questions. Built an AI-powered answer evaluation system providing category-wise scores, strengths, improvement areas, and personalized recommendations. Integrated REST APIs for frontend-backend communication and deployed the React frontend on Vercel and FastAPI backend on Render using secure environment-based API configuration.

---

# 📌 Project Highlights

| Feature                      | Technology            |
| ---------------------------- | --------------------- |
| 🤖 AI Interview Generation   | Google Gemini         |
| 📄 Resume Processing         | PyPDF                 |
| 💼 Job-Specific Questions    | Google Gemini         |
| 🧑‍💻 Technical Questions    | Google Gemini         |
| 🧠 Situational Questions     | Google Gemini         |
| 🤝 HR / Behavioral Questions | Google Gemini         |
| 📊 Answer Evaluation         | Google Gemini         |
| ⚛️ Frontend                  | React + Vite          |
| ⚡ Backend                    | FastAPI               |
| 🐍 Backend Language          | Python                |
| 🔗 Communication             | REST API              |
| ☁️ Frontend Deployment       | Vercel                |
| 🚀 Backend Deployment        | Render                |
| 📚 API Documentation         | Swagger / ReDoc       |
| 🔐 Configuration             | Environment Variables |
| 📦 Version Control           | Git + GitHub          |

---

# 🌐 Project Links

### 🚀 Live Application

https://ai-interview-evaluation-system.vercel.app

### 💻 GitHub Repository

https://github.com/itsmevijay005/AI-Interview-Evaluation-System

### ⚡ Backend API

https://ai-interview-evaluation-system.onrender.com

### 📚 Swagger API Documentation

https://ai-interview-evaluation-system.onrender.com/docs

### 📖 ReDoc API Documentation

https://ai-interview-evaluation-system.onrender.com/redoc

---

# 👨‍💻 Developer

## VIJAY SAI GUNA PAGOTI

**AI & Machine Learning Enthusiast | Full Stack Developer | CSE Undergraduate**

### GitHub

https://github.com/itsmevijay005

### Project Repository

https://github.com/itsmevijay005/AI-Interview-Evaluation-System

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

### 1. Fork the Repository

Fork the project using GitHub.

### 2. Clone the Repository

```bash
git clone https://github.com/itsmevijay005/AI-Interview-Evaluation-System.git
```

### 3. Navigate to the Project

```bash
cd AI-Interview-Evaluation-System
```

### 4. Create a Feature Branch

```bash
git checkout -b feature/your-feature
```

### 5. Make Your Changes

```bash
git add .
```

### 6. Commit Your Changes

```bash
git commit -m "Add your feature"
```

### 7. Push the Branch

```bash
git push origin feature/your-feature
```

Then create a Pull Request on GitHub.

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

Your feedback and suggestions are always welcome.

---

# 📜 License

This project is developed for:

* Educational purposes
* Portfolio demonstration
* Interview preparation
* Generative AI application development
* Full-stack development practice

---

<p align="center">
  <strong>Built with React, FastAPI, Python & Google Gemini AI</strong>
</p>

<p align="center">
  Made with ❤️ by <strong>VIJAY SAI GUNA PAGOTI</strong>
</p>

<p align="center">
  <strong>AI Interview Evaluation System</strong>
  <br/>
  Practice Smarter • Improve Faster • Interview with Confidence
</p>
