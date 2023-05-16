const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${API_KEY}`
    );
    const data = response.data;
    if (!data || data.status === "ZERO_RESULTS") {
        const error = new HttpError(
            "Cound not find location for the specified address.",
            422
        );
        throw error;
    }
    let coordinates;
    try {
        coordinates = data.results[0].geometry.location;
    } catch (err) {
        const error = new HttpError(
            "you have used up all the requests for the day. Please wait until tomorrow to continue using.",
            500
        );
        throw error;
    } // thêm phần này
    return coordinates;
}

module.exports = getCoordsForAddress;
