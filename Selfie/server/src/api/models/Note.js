import mongoose from 'mongoose';

const {Schema, model} = mongoose;

const NoteSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxlength: [100, "Title must be less than 100 characters"],
    },
    text: {
        type: String,
        required: [true, "Text is required"],
        maxlength: [500, "Text must be less than 500 characters"],
    },
    categories: {
        type: [String],
        default: [],
        validate: {
            validator: (v) => Array.isArray(v) && v.every((item) => typeof item === "string"),
            message: "Categories must be an array of strings",
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
}, {
    timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"},
});

const Note = model('Note', NoteSchema);
export default Note;
