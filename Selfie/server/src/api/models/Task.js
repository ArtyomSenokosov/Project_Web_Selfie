import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    isOverdue: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: String,
        enum: ["low", "normal", "high"],
        default: "normal",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

taskSchema.pre("save", function (next) {
    if (this.dueDate < new Date() && !this.isCompleted) {
        this.isOverdue = true;
    } else {
        this.isOverdue = false;
    }
    next();
});

taskSchema.post("find", function (docs) {
    docs.forEach((task) => {
        if (task.dueDate < new Date() && !task.isCompleted) {
            task.isOverdue = true;
        } else {
            task.isOverdue = false;
        }
    });
});

export default mongoose.model("Task", taskSchema);
