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
        default: null,
    },
    reportedAt:{
        type: Date,
    },
    cleanedAt:{
        type: Date,
    },
    status:{
        type: String,
        enum: ["pending", "completed","assigned" ,"cancelled"],
        default: "pending",
    },
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
      },      
}, {timestamps: true});

const Trash = mongoose.model("Trash", trashSchema);

export default Trash;
