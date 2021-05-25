var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const league_utils = require("./utils/league_utils");
const adminId = 3;

router.use(async function(req, res, next) {
    // check if user is admin
    if (req.session.user_id != adminId) {
        res.status(403).send("Only admins can get this page");
    } else {
        next();
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

router.get("/getAllGamesSorted/:value", async(req, res, next) => {
    try {
        const value = req.params.value;
        const sorted_league_games = await league_utils.sortLeagueGames(value);
        res.send(sorted_league_games);
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


router.put("/updateGame/:gameId", async(req, res, next) => {
    try {
        await DButils.execQuery(`update dbo.games set score = '${req.body.score}' where game_id = '${req.params.gameId}'`);
        res.status(201).send("game updated");

    } catch (error) {
        next(error);
    }
});

router.post("/insertActivity/:gameId", async(req, res, next) => {
    try {
        await DButils.execQuery(`insert into dbo.game_activity (game_id, date, time, minute, description) VALUES (
            '${req.params.gameId}', '${req.body.date}','${req.body.time}', '${req.body.minute}','${req.body.description}') `);
        res.status(201).send("activity added");

    } catch (error) {
        next(error);
    }
});




module.exports = router;