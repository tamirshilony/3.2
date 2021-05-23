var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
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

router.post("/addGame", async(req, res, next) => {
    try {
        await DButils.execQuery(
            `INSERT INTO dbo.games (date, time, home_team, away_team, stadium) VALUES (
                '${req.body.date}', '${req.body.time}','${req.body.home_team}', '${req.body.away_team}','${req.body.stadium}')`
        );
        res.status(201).send("game added");
    } catch (error) {
        next(error);
    }
});


router.post("/updateGame/:gameId", async(req, res, next) => {
    try {
        await DButils.execQuery(`update dbo.games set score = '${req.body.score}' where game_id = '${req.params.gameId}'`);
        res.status(201).send("game updated");

    } catch (error) {
        next(error);
    }
});

module.exports = router;