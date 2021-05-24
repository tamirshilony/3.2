var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");

router.get("/playerDetails/:playerId", async(req, res, next) => {
    try {
        const player_details = await players_utils.getPlayerCard(req.params.playerId);
        res.send(player_details);
    } catch (error) {
        next(error);
    }
});

router.get("/playerSearch/:playerName/:position", async(req, res, next) => {
    try {
        // get all require info about players that match the playerName
        const players_details = await players_utils.findMatchPlayers(req.params.playerName);
        let fillter_players_details = [];

        res.send(players_details);
    } catch (error) {
        next(error);
    }
});

router.get("/playerSearch/:playerName/:team_name", async(req, res, next) => {
    try {
        // get all require info about players that match the playerName
        const players_details = await players_utils.findMatchPlayers(req.params.playerName, req.params.fillter);

        res.send(players_details);
    } catch (error) {
        next(error);
    }
});

router.get("/playerSearch/:playerName", async(req, res, next) => {
    try {
        // get all require info about players that match the playerName
        const players_details = await players_utils.findMatchPlayers(req.params.playerName);
        res.send(players_details);
    } catch (error) {
        next(error);
    }
});



module.exports = router;