const uuid = require("uuid");

const HttpError = require("../models/http-error");

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

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;

    const place = DUMMY_PLACES.find((p) => p.id === placeId);

    if (!place) {
        throw new HttpError("Could not find a place for the provided id.", 404);
    }

    res.json({ place }); //{ place } => { place: place }
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const places = DUMMY_PLACES.filter((p) => {
        return p.creator === userId;
    });
    if (!places || places.length === 0) {
        return next(
            new HttpError(
                "Could not find a place for the provided user id.",
                404
            )
        );
    }
    res.json({ places });
};

const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        id: uuid.v4(),
        title,
        description,
        location: coordinates,
        address,
        creator,
    };
    DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)
    res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
    const { title, description } = req.body;
    const placeId = req.params.pid;
    const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
    const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;
    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({ place: updatedPlace });
};

const deletePlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
    res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
