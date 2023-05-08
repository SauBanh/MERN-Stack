const uuid = require("uuid");
const { validationResult } = require("express-validator");

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
    const createdNewUser = new User({
        name,
        email,
        image: "https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/274217740_469277344689956_4712296035433322684_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=174925&_nc_ohc=rwUOlKlzrKcAX-PS3LM&_nc_ht=scontent.fsgn5-10.fna&oh=00_AfAcHfFlkk_7egKxp2OrP8zuOG24w-vFNtSs8Ths75MSLA&oe=645B9F25",
        password,
        places: [],
    });
    try {
        await createdNewUser.save();
    } catch (err) {
        const error = new HttpError(
            "Siging Up failed, please try again 123.",
            500
        );
        return next(error);
    }
    res.status(201).json({ user: createdNewUser.toObject({ getters: true }) });
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
    if (existingUser.password !== password) {
        const error = new HttpError("Wrong password, please try again!", 401);
        return next(error);
    }

    res.json({ mesage: "logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
