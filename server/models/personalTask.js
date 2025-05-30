import mongoose from "mongoose";

const personalTaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  date: { type: Date },
  priority: { type: String },
  status: { type: String, default: "todo" },
  notes: { type: String },
  isTrashed: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const PersonalTask = mongoose.model("PersonalTask", personalTaskSchema);

export default PersonalTask;
