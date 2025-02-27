const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email id is not proper');
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Password is not strong');
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        // required: true
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"]) {
                throw new Error("Gender value not correct")
            }
        }
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    membershipType: {
        type: String,
    },
    photoUrl: {
        type: String,
        default: "https://static-00.iconduck.com/assets.00/profile-circle-icon-256x256-cm91gqm2.png",
        validate(value) {
            if (!validator?.isURL(value)) {
                throw new Error('URL is not proper');
            }
        }
    },
    skills: {
        type: [String]
    },
    about: {
        type: String
    }
}, {
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, 'Sarthak@123', { expiresIn: '7d' });
    return token;
}

userSchema.methods.validatePassword = async function (passwordByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordByUser, user.password);
    return isPasswordValid;
}
const User = mongoose.model("User", userSchema);

module.exports = User;