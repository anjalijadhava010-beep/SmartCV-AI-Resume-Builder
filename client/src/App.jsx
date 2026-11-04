import React from "react";
import { useMemo, useState } from "react";

import {
  Sparkles,
  Download,
  Save,
  FolderOpen,
  FileText,
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  Code2,
  CheckCircle2,
  WandSparkles
} from "lucide-react";

const API = "https://smartcv-backend-y284.onrender.com/api";

const initialResume = {
  fullName: "Your Name",
  role: "Computer Engineering Student",
  email: "you@example.com",
  phone: "+91 98765 43210",
  location: "Mumbai, India",
  linkedin: "",
  github: "",
  summary:
    "Motivated computer engineering student interested in software development. Enjoys building useful web applications and learning new technologies.",
  education:
    "B.E. Computer Engineering | Your College | 2023 – 2027\nCGPA: 8.5/10",
  experience:
    "Frontend Developer Intern | Company Name | Jun 2026 – Aug 2026\n• Built responsive user interface components using React.\n• Collaborated with team members to improve usability.",
  projects:
    "Smart Resume Builder | React, Node.js, MongoDB\n• Developed a web application to create resumes and receive AI-based improvement suggestions.\n• Added live preview and PDF export.",
  skills:
    "JavaScript, React, HTML, CSS, Node.js, Express, MongoDB, Python, MySQL",
  certifications: "React Fundamentals | Online Course"
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  rows
}) {
  return (
    <label className="field">
      <span>{label}</span>

      {rows ? (
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="form-section">
      <h3>
        <span className="section-icon">
          <Icon size={17} />
        </span>
        {title}
      </h3>

      {children}
    </section>
  );
}

export default function App() {
  const [resume, setResume] = useState(initialResume);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [aiMode, setAiMode] = useState("");

  const skills = useMemo(
    () =>
      resume.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [resume.skills]
  );

  function update(key, value) {
    setResume((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  // GEMINI AI SUGGESTIONS
  async function getSuggestions() {
    setLoadingAI(true);
    setStatus("");

    try {
      const response = await fetch(`${API}/ai/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ resume })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not generate suggestions."
        );
      }

      setSuggestions(data.suggestions || []);
      setAiMode(data.mode || "AI");

    } catch (error) {
      console.error("AI Error:", error);

      setStatus(
        `AI service: ${error.message}. Start the backend and try again.`
      );

    } finally {
      setLoadingAI(false);
    }
  }

  // SAVE RESUME TO MONGODB
  async function saveResume() {
    setSaving(true);
    setStatus("");

    try {
      // Remove MongoDB-generated fields to avoid duplicate IDs
      const {
        _id,
        __v,
        createdAt,
        updatedAt,
        ...resumeToSave
      } = resume;

      const response = await fetch(`${API}/resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(resumeToSave)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.message ||
          "Could not save resume."
        );
      }

      setStatus(
        "Resume saved successfully in MongoDB!"
      );

    } catch (error) {
      console.error("Save Resume Error:", error);

      setStatus(
        `Save failed: ${error.message}`
      );

    } finally {
      setSaving(false);
    }
  }

  // LOAD LATEST RESUME FROM MONGODB
  async function LoadResume() {
    setStatus("");

    try {
      const response = await fetch(
        `${API}/resumes/latest`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load resume."
        );
      }

      setResume({
        ...initialResume,
        ...data.resume
      });

      setStatus(
        "Latest saved resume loaded successfully!"
      );

    } catch (error) {
      console.error("Load Resume Error:", error);

      setStatus(
        `Load failed: ${error.message}`
      );
    }
  }

  return (
    <div className="app-shell">

      {/* HEADER */}
      <header className="topbar">

        <a className="brand" href="#">
          <span className="brand-mark">
            <FileText size={20} />
          </span>

          Smart<span>CV</span>
        </a>

        <div className="top-actions">

          <button
            className="btn btn-light"
            onClick={LoadResume}
          >
            <FolderOpen size={16} />
            Load saved
          </button>

          <button
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            <Download size={16} />
            Download PDF
          </button>

        </div>
      </header>

      <main className="page">

        {/* INTRODUCTION */}
        <div className="intro">

          <div className="eyebrow">
            <Sparkles size={14} />
            AI-POWERED RESUME BUILDER
          </div>

          <h1>
            Build a resume that{" "}
            <span>gets noticed.</span>
          </h1>

          <p>
            Enter your details, get smart improvement tips,
            and create a professional resume in minutes.
          </p>

        </div>

        <div className="workspace">

          <div className="editor-column">

            {/* RESUME EDITOR */}
            <div className="panel editor-panel">

              <div className="panel-heading">

                <div>
                  <div className="panel-kicker">
                    YOUR DETAILS
                  </div>

                  <h2>Resume editor</h2>
                </div>

                <span className="step-pill">
                  01 / EDIT
                </span>

              </div>

              {/* PERSONAL INFORMATION */}
              <Section
                icon={UserRound}
                title="Personal information"
              >

                <div className="grid two">

                  <Field
                    label="Full name"
                    value={resume.fullName}
                    onChange={(e) =>
                      update("fullName", e.target.value)
                    }
                    placeholder="Your full name"
                  />

                  <Field
                    label="Professional title"
                    value={resume.role}
                    onChange={(e) =>
                      update("role", e.target.value)
                    }
                    placeholder="e.g. Frontend Developer"
                  />

                  <Field
                    label="Email"
                    type="email"
                    value={resume.email}
                    onChange={(e) =>
                      update("email", e.target.value)
                    }
                    placeholder="you@email.com"
                  />

                  <Field
                    label="Phone"
                    value={resume.phone}
                    onChange={(e) =>
                      update("phone", e.target.value)
                    }
                    placeholder="+91 ..."
                  />

                  <Field
                    label="Location"
                    value={resume.location}
                    onChange={(e) =>
                      update("location", e.target.value)
                    }
                    placeholder="City, Country"
                  />

                  <Field
                    label="LinkedIn URL"
                    value={resume.linkedin}
                    onChange={(e) =>
                      update("linkedin", e.target.value)
                    }
                    placeholder="linkedin.com/in/yourname"
                  />

                  <div className="span-two">

                    <Field
                      label="GitHub / Portfolio URL"
                      value={resume.github}
                      onChange={(e) =>
                        update("github", e.target.value)
                      }
                      placeholder="github.com/yourname"
                    />

                  </div>

                </div>

              </Section>

              {/* PROFESSIONAL SUMMARY */}
              <Section
                icon={FileText}
                title="Professional summary"
              >

                <Field
                  label="About you (2–4 lines)"
                  rows={4}
                  value={resume.summary}
                  onChange={(e) =>
                    update("summary", e.target.value)
                  }
                  placeholder="Write a short professional introduction..."
                />

              </Section>

              {/* EDUCATION */}
              <Section
                icon={GraduationCap}
                title="Education"
              >

                <Field
                  label="Qualification, college, dates and grade"
                  rows={4}
                  value={resume.education}
                  onChange={(e) =>
                    update("education", e.target.value)
                  }
                  placeholder="Degree | College | Year"
                />

              </Section>

              {/* EXPERIENCE */}
              <Section
                icon={BriefcaseBusiness}
                title="Experience"
              >

                <Field
                  label="Role, organisation, dates and achievements"
                  rows={5}
                  value={resume.experience}
                  onChange={(e) =>
                    update("experience", e.target.value)
                  }
                  placeholder="Add internship, work experience or relevant volunteering..."
                />

              </Section>

              {/* PROJECTS */}
              <Section
                icon={Code2}
                title="Projects"
              >

                <Field
                  label="Project name, technologies and what you built"
                  rows={5}
                  value={resume.projects}
                  onChange={(e) =>
                    update("projects", e.target.value)
                  }
                  placeholder="Project name | Tech stack&#10;• What you built&#10;• Impact or result"
                />

              </Section>

              {/* SKILLS AND CERTIFICATIONS */}
              <Section
                icon={WandSparkles}
                title="Skills & certifications"
              >

                <Field
                  label="Skills (separate with commas)"
                  rows={3}
                  value={resume.skills}
                  onChange={(e) =>
                    update("skills", e.target.value)
                  }
                  placeholder="React, JavaScript, Python..."
                />

                <Field
                  label="Certifications / courses"
                  rows={2}
                  value={resume.certifications}
                  onChange={(e) =>
                    update("certifications", e.target.value)
                  }
                  placeholder="Course name | Provider"
                />

              </Section>

              {/* ACTION BUTTONS */}
              <div className="editor-footer">

                <button
                  className="btn btn-outline"
                  onClick={saveResume}
                  disabled={saving}
                >
                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : "Save resume"}
                </button>

                <button
                  className="btn btn-ai"
                  onClick={getSuggestions}
                  disabled={loadingAI}
                >
                  <Sparkles size={16} />

                  {loadingAI
                    ? "Analysing..."
                    : "Get AI suggestions"}
                </button>

              </div>

              {status && (
                <div className="status-message">
                  {status}
                </div>
              )}

            </div>

            {/* AI ASSISTANT */}
            <div className="panel ai-panel">

              <div className="ai-title">

                <span className="ai-icon">
                  <Sparkles size={18} />
                </span>

                <div>
                  <div className="panel-kicker">
                    SMART ASSISTANT
                  </div>

                  <h2>AI improvement tips</h2>
                </div>

              </div>

              {suggestions.length ? (
                <>

                  <div className="mode-label">
                    {aiMode === "gemini"
                      ? "Generated with Google Gemini"
                      : "Built-in demo suggestions"}
                  </div>

                  <ul className="suggestion-list">

                    {suggestions.map((item, index) => (
                      <li key={index}>
                        <CheckCircle2 size={17} />

                        <span>{item}</span>
                      </li>
                    ))}

                  </ul>

                </>
              ) : (

                <p className="muted">
                  Click "Get AI suggestions" to check your
                  resume for missing details, stronger wording
                  and skill improvements.
                </p>

              )}

            </div>

          </div>

          {/* LIVE RESUME PREVIEW */}
          <aside className="preview-column">

            <div className="preview-heading">

              <div>
                <div className="panel-kicker">
                  LIVE PREVIEW
                </div>

                <h2>Your resume</h2>
              </div>

              <span className="live-dot">
                LIVE
              </span>

            </div>

            <article
              className="resume-paper"
              id="resume-preview"
            >

              <div className="resume-head">

                <h1>
                  {resume.fullName || "Your Name"}
                </h1>

                <div className="resume-role">
                  {resume.role}
                </div>

                <div className="contact-line">
                  {[
                    resume.email,
                    resume.phone,
                    resume.location
                  ]
                    .filter(Boolean)
                    .join("  •  ")}
                </div>

                <div className="contact-line links">
                  {[
                    resume.linkedin,
                    resume.github
                  ]
                    .filter(Boolean)
                    .join("  •  ")}
                </div>

              </div>

              <ResumeBlock title="Professional Summary">
                <p>
                  {resume.summary ||
                    "Add a short professional summary."}
                </p>
              </ResumeBlock>

              <ResumeBlock title="Education">
                <pre>
                  {resume.education ||
                    "Add your education details."}
                </pre>
              </ResumeBlock>

              <ResumeBlock title="Experience">
                <pre>
                  {resume.experience ||
                    "Add your experience or internships."}
                </pre>
              </ResumeBlock>

              <ResumeBlock title="Projects">
                <pre>
                  {resume.projects ||
                    "Add your projects."}
                </pre>
              </ResumeBlock>

              <ResumeBlock title="Technical Skills">

                <div className="skill-tags">

                  {skills.length ? (
                    skills.map((s, i) => (
                      <span key={i}>{s}</span>
                    ))
                  ) : (
                    <span>Add skills</span>
                  )}

                </div>

              </ResumeBlock>

              <ResumeBlock title="Certifications">
                <pre>
                  {resume.certifications ||
                    "Add certifications or courses."}
                </pre>
              </ResumeBlock>

            </article>

            <p className="preview-note">
              <CheckCircle2 size={14} />
              Your preview updates automatically as you type.
            </p>

          </aside>

        </div>

        <footer>
          SmartCV · Student project · Create, improve and export your resume
        </footer>

      </main>

    </div>
  );
}

// RESUME PREVIEW SECTION
function ResumeBlock({ title, children }) {
  return (
    <section className="resume-block">
      <h3>{title}</h3>
      {children}
    </section>
  );
}