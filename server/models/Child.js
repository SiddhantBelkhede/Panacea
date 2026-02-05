import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentName: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  uniqueCode: {
    type: String,
    required: true,
    unique: true,
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  // This is for later when I have histor to update
  vaccinationHistory: [
    {
      vaccineName: String,
      date: Date,
      notes: String, // Notes from docter/hospital for AI
      hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Child", ChildSchema);
