const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRouter = require("./routers/places-routes");
const usersRouter = require("./routers/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter);

app.use((req, res, next) => {
    const error = new HttpError("Cound not find this route.", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
    .connect(
        "mongodb+srv://saubanh05062001:w2f9JPgONIOn6idn@mern-stack.qaiddcb.mongodb.net/places?retryWrites=true&w=majority"
    )
    .then(() => {
        app.listen(5000, () => {
            console.log("listening on 5000");
        });
    })
    .catch((err) => console.log(err));
