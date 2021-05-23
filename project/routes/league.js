var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");

router.get("/getDetails", async(req, res, next) => {
    try {
        const league_details = await league_utils.getLeagueDetails();
        res.send(league_details);
    } catch (error) {
        next(error);
    }
});

router.get("/getAllGames", async(req, res, next) => {
    try {
        const league_game = await league_utils.getLeagueGames();
        res.send(league_game);
    } catch (error) {
        next(error);
    }
});

module.exports = router;