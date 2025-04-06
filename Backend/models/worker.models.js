import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Report from "./reports.models.js";

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tasks:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Trash",
    },
    tasksCompleted:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Trash",
    },
    points: {
        type: Number,
        default: 0,
    }
});

// Hash password before saving
workerSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to match password
workerSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;
