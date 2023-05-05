const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
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

router.get("/:pid", (req, res, next) => {
    const placeId = req.params.pid;

    const place = DUMMY_PLACES.find((p) => p.id === placeId);

    if (!place) {
        const error = new Error("Could not find a place for the provided id.");
        error.code = 404;
        throw error;
    }

    res.json({ place }); //{ place } => { place: place }
});

router.get("/user/:uid", (req, res, next) => {
    const userId = req.params.uid;

    const place = DUMMY_PLACES.find((p) => {
        return p.creator === userId;
    });
    if (!place) {
        const error = new Error("Could not find a place for the provided id.");
        error.code = 404;
        return next(error);
    }
    res.json({ place });
});

module.exports = router;
