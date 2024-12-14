const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        unique: true,
        lowerCase: true,
        trim: true
    },
    password: {
        type: String
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"]) {
                throw new Error("Gender value not correct")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "nfjdsn"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema)

module.exports = User;