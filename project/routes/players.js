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

router.get("/playerSearch/:playerName", async(req, res, next) => {
    let player_details = [];
    try {
        // get all id that match the playerName
        const match_player_id = await players_utils.findMatchPlayers(req.params.playerName);
        // extract the player data
        const player_details = await players_utils.getPlayersInfo(match_player_id);
        res.send(player_details);
    } catch (error) {
        next(error);
    }
});