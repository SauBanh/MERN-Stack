const uuid = require("uuid");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
    {
        id: "u1",
        name: "Nguyễn Tuấn Anh",
        email: "ngtuananh.developer@gmail.com",
        password: "testers",
        // image: "https://scontent.fsgn5-2.fna.fbcdn.net/v/t39.30808-6/259741744_416359749981716_3280018264072678351_n.jpg?stp=dst-jpg_s851x315&_nc_cat=105&ccb=1-7&_nc_sid=da31f3&_nc_ohc=89MbXITYQ2gAX8x-FHJ&_nc_ht=scontent.fsgn5-2.fna&oh=00_AfApDp48EMk5AmiX385PRe-orUVxgaJUxaKxo5wh_Biy2g&oe=645172A4",
        // places: 3,
    },
];

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
    const { name, email, password } = req.body;
    const hasUser = DUMMY_USERS.find((u) => u.email === email);
    if (hasUser) {
        throw new HttpError(
            "Cound not create user, email already exists!",
            422
        );
    }
    const createNewUser = {
        id: uuid.v4(),
        name,
        email,
        password,
    };
    DUMMY_USERS.push(createNewUser);
    res.status(201).json({ user: createNewUser });
};

const login = (req, res, next) => {
    const { email, password } = req.body;
    const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
    if (!identifiedUser) {
        throw new HttpError("Cound not identify user!", 401);
    }
    if (identifiedUser.password !== password) {
        throw new HttpError("Wrong password try again!", 401);
    }

    res.json({ mesage: "logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
