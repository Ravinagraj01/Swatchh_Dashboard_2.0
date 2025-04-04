import mongoose from "mongoose";

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
        ref: "Task",
    },
    tasksCompleted:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Task",
    },
    
});

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;
