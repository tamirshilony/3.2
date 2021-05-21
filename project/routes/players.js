var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/playerDetails/:playerId", async(req, res, next) => {
    try {
        const player_details = await players_utils.getLeagueDetails();
        res.send(league_details);
    } catch (error) {
        next(error);
    }
});