var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const league_utils = require("./utils/league_utils");
const adminId = 3;


router.get("/getAllGames", async(req, res, next) => {
    try {
        const league_game = await league_utils.getLeagueGames();
        if (!league_game)
            throw { status: 400, message: "Search failed" };
        res.send(league_game);
    } catch (error) {
        next(error);
    }
});


router.get("/getAllGamesSorted/:value", async(req, res, next) => {
    try {
        const value = req.params.value;
        const sorted_league_games = await league_utils.sortLeagueGames(value);
        if (!sorted_league_games)
            throw { status: 400, message: "Search failed" };
        res.send(sorted_league_games);
    } catch (error) {
        next(error);
    }
});

router.use(async function(req, res, next) {
    // check if user is admin
    if (req.session.user_id != adminId) {
        res.status(401).send("Only admins can get this page");
    } else {
        next();
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
        if(req.body.score === undefined)
            throw { status: 401, message: "No score provided" }
        await DButils.execQuery(`update dbo.games set score = '${req.body.score}' where game_id = '${req.params.gameId}'`);
        // if(!rowUpdated)
        //     throw { status: 401, message: "No such game"}
        res.status(201).send("game updated");
    } catch (error) {
        next(error);
    }
});

router.post("/insertActivity", async(req, res, next) => {
    try {
        await DButils.execQuery(`insert into dbo.game_activity (game_id, date, time, minute, description) VALUES (
            '${req.body.gameId}', '${req.body.date}','${req.body.time}', '${req.body.minute}','${req.body.description}') `);
        res.status(201).send("activity added");

    } catch (error) {
        res.status(400).send("couldnt insert activity");
    }
});


module.exports = router;