import mongoose from "mongoose";

const trashSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    workerAssigned:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
    },
    status:{
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending",
    },
});

const Trash = mongoose.model("Trash", trashSchema);

export default Trash;
