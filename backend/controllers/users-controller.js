const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-password");
    } catch (err) {
        return next(
            new HttpError("Fetching users failed, please try again latter", 500)
        );
    }
    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(
            new HttpError(
                "Invalid input passed, please check your data body",
                422
            )
        );
    }
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            "Signup failed, please try again later",
            500
        );
        return next(error);
    }
    if (existingUser) {
        const error = new HttpError(
            "User exists already, please login instead",
            422
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            "Could not create user, please try again",
            500
        );
        return next(error);
    }

    const createdNewUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: [],
    });
    try {
        await createdNewUser.save();
    } catch (err) {
        console.error(err);
        const error = new HttpError("Siging Up failed, please try again.", 500);
        return next(error);
    }
    let token;
    try {
        jwt.token = jwt.sign(
            { userId: createdNewUser.id, email: createdNewUser.email },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );
    } catch (err) {
        console.error(err);
        const error = new HttpError("Siging Up failed, please try again.", 500);
        return next(error);
    }
    res.status(201).json({
        userId: createdNewUser.id,
        email: createdNewUser.email,
        token,
    });
};

const login = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(
            new HttpError("Invalid input passed, please check your data", 422)
        );
    }
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            "logging in failed, please try again later",
            500
        );
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError("User does not exist!", 500);
        return next(error);
    }

    let isValidPassword = false;

    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
            "Cound not log you in, please check your credentials and try again",
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError("Wrong password, please try again!", 401);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            "Logging in failed, please try again.",
            500
        );
        return next(error);
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token,
    });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
