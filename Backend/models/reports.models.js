import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    type : {
        type: String,
        enum: ["complaint", "suggestion", "feedback"],
        required: true,
    },
    status:{
        type: String,
        enum: ["pending", "resolved", "rejected"],
        default: "pending",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
        default: null,
      }
        
},{timestamps: true});

const Report = mongoose.model("Report", reportSchema);

export default Report;


