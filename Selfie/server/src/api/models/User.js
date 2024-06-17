import mongoose from 'mongoose';

const {Schema, model} = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    birthDate: {
        type: Date,
        default: null
    }
}, {
    toJSON: {
        transform: documentToJson
    },
    toObject: {}
});

UserSchema.virtual('notes', {
    ref: 'Note',
    localField: '_id',
    foreignField: 'user'
});

UserSchema.virtual('events', {
    ref: 'Event',
    localField: '_id',
    foreignField: 'owner'
});

function documentToJson(doc, ret) {
    delete ret.__v;
    delete ret.password;
    return ret;
}

const User = model('User', UserSchema);
export default User;
