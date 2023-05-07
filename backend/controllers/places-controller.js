const uuid = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
    {
        id: "p1",
        title: "Tất niên cuối năm",
        description: "Tất niên cuối năm tại nhà Tuấn Anh đẹp trai",
        location: {
            lat: 10.888005,
            lng: 106.645651,
        },
        address: "Le Van Khuong Quan 12 HCM",
        creator: "u1",
    },
];

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

    let places;

    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        const error = new HttpError(
            "Fetching places failed, please try again later.",
            500
        );
        return next(error);
    }
    if (!places || places.length === 0) {
        return next(
            new HttpError(
                "Could not find a place for the provided user id.",
                404
            )
        );
    }
    res.json({
        places: places.map((place) => place.toObject({ getters: true })),
    });
};

const createPlace = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(
            new HttpError("Invalid input passed, please check your data", 422)
        );
    }
    const { title, description, address, creator } = req.body;
    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: "https://scontent.fsgn5-2.fna.fbcdn.net/v/t39.30808-6/259741744_416359749981716_3280018264072678351_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=19026a&_nc_ohc=gy1_T0v9BqcAX-bBirH&_nc_ht=scontent.fsgn5-2.fna&oh=00_AfBL-kQ6ljPV3A_0wTRhnQpMbmE04l8iSsq8tDJsHKpKnA&oe=645B55E4",
        creator,
    });
    try {
        await createdPlace.save();
    } catch (err) {
        const error = new HttpError(
            "Creating place failed, please try again ",
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
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            "Some thing went wrong, could not delete place.",
            500
        );
        return next(error);
    }
    try {
        await place.deleteOne();
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            "Some thing went wrong, could not delete place.",
            500
        );
        return next(error);
    }
    res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
