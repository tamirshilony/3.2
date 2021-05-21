var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/playerSearch/:playerId", async(req, res, next) => {
    let player_details = [];
    try {
        const tplyer_details = await players_utils.getPlayersInfo(
            req.params.playerId
        );
        res.send(player_details);
    } catch (error) {
        next(error);
    }
});