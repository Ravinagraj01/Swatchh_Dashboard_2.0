import mongoose from "mongoose";
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
    // password: {
    //     type: String,
    //     required: true,
    // },
    tasks:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Trash",
    },
    tasksCompleted:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Trash",
    },
    
});

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;
