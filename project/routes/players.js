var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");

router.get("/playerDetails/:playerId", async(req, res, next) => {
    try {
        const player_details = await players_utils.getLeagueDetails();
        res.send(league_details);
    } catch (error) {
        next(error);
    }
});

router.get("/playerSearch/:playerName", async(req, res, next) => {
    try {
        // get all id that match the playerName
        const players_details = await players_utils.findMatchPlayers(req.params.playerName);
        res.send(players_details);
    } catch (error) {
        next(error);
    }
});

module.exports = router;