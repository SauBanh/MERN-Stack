const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const { uploadFirebase } = require("../middleware/file-upload");

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            "Some thing went wrong, cound not find a place.",
            500
        );
        return next(error);
    }

    if (!place) {
        const error = new HttpError(
            "Could not find a place for the provided id.",
            404
        );
        return next(error);
    }

    res.json({ place: place.toObject({ getters: true }) }); //{ place } => { place: place }
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    // let places;
    let userWithPlaces;

    try {
        // userWithPlaces = await Place.find({ creator: userId });
        userWithPlaces = await User.findById(userId).populate("places");
    } catch (err) {
        const error = new HttpError(
            "Fetching places failed, please try again later.",
            500
        );
        return next(error);
    }
    if (!userWithPlaces || userWithPlaces.length === 0) {
        return next(
            new HttpError(
                "Could not find a place for the provided user id.",
                404
            )
        );
    }
    res.json({
        places: userWithPlaces.places.map((place) =>
            place.toObject({ getters: true })
        ),
    });
};

const createPlace = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(
            new HttpError("Invalid input passed, please check your data", 422)
        );
    }
    const { title, description, address } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        console.log("coordinates error", error);
        return next(error);
    }
    const file = req.file;
    if (!file) {
        return res.status(400).send("Please upload a file");
    }
    const MIME_TYPE_MAP = {
        "image/png": "png",
        "image/jpeg": "jpeg",
        "image/jpg": "jpg",
    };
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    if (!isValid) {
        return res.status(400).send("Please upload a image");
    }
    let pathImage;
    try {
        pathImage = await uploadFirebase(file);
    } catch (err) {
        const error = new HttpError(
            "Could not create image in to firebase, please try again",
            500
        );
        console.log(err);
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates, //change again coordinates
        image: pathImage,
        creator: req.userData.userId,
    });

    let user;

    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            "Creating place failed, please try again ",
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError("Cound not find user for provided id", 404);
        return next(error);
    }

    // console.log(user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Creating place failed, please try again 123",
            500
        );
        return next(error);
    }
    res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(
            new HttpError("Invalid input passed, please check your data", 422)
        );
    }
    const { title, description } = req.body;
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            "Some thing went wrong, could not update place.",
            500
        );
        return next(error);
    }
    if (place.creator.toString() !== req.userData.userId) {
        const error = new HttpError(
            "You are not allowed to edit this place.",
            403 //401 là chưa có thông tin đăng nhập
        );
        return next(error);
    }
    place.title = title;
    place.description = description;
    try {
        await place.save();
    } catch (err) {
        const error = new HttpError(
            "Some thing went wrong, could not update place.",
            500
        );
        return next(error);
    }
    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId).populate("creator");
    } catch (err) {
        const error = new HttpError(
            "Some thing went wrong, could not delete place.",
            500
        );
        return next(error);
    }

    if (!place) {
        const error = new HttpError("Cound not find place for this id.", 404);
        return next(error);
    }

    if (place.creator.id !== req.userData.userId) {
        const error = new HttpError(
            "You are not allowed to edit this place.",
            403 //403 là đã xác thực nhưng không có quyền action hành động này
        );
        return next(error);
    }

    const imagePath = place.image;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Some thing went wrong, could not delete place.",
            500
        );
        return next(error);
    }

    fs.unlink(imagePath, (err) => {
        console.log(err);
    });

    res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
