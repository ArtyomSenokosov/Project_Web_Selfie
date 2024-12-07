import mongoose from 'mongoose';

const {Schema, model} = mongoose;

const EventSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    start: {
        type: Date,
        required: [true, "Start date is required"]
    },
    end: {
        type: Date,
        required: [true, "End date is required"],
    },
    notes: {
        type: String,
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        maxlength: 128,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    type: {
        type: String,
        enum: ['one-time', 'recurring'],
        required: [true, "Event type is required"]
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: function () {
            return this.type === 'recurring';
        }
    },
    status: {
        type: String,
        enum: ['completed', 'pending'],
        default: 'pending'
    },
    duration: {
        type: String,
        enum: ['short-term', 'long-term'],
        required: [true, "Event duration is required"]
    }
}, {
    toJSON: {transform: cleanDocument}
});

function cleanDocument(doc, ret) {
    delete ret.__v;
    return ret;
}

const Event = model('Event', EventSchema);
export default Event;
