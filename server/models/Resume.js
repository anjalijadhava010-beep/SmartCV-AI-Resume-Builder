import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  fullName: String,
  role: String,
  email: String,
  phone: String,
  location: String,
  linkedin: String,
  github: String,
  summary: String,
  education: String,
  experience: String,
  projects: String,
  skills: String,
  certifications: String
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
