const validator = require('validator');

const ValidateSignUp = (req) => {

    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First Name and Last Name can not be empty");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("email id id not correct");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }
}

module.exports = { ValidateSignUp };