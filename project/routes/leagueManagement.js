var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const league_utils = require("./utils/league_utils");
const adminId = 1;

// those first 2 function will use in the current fixture page
router.get("/getAllGames", async(req, res, next) => {
    try {
        const league_game = {};
        league_game.game = await league_utils.getLeagueGames();
        league_game.activity = await DButils.execQuery("select * from dbo.game_activity order by game_id");
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
            `INSERT INTO dbo.games (date, time, home_team, away_team, stadium, referee) VALUES (
                '${req.body.date}', '${req.body.time}','${req.body.home_team}', '${req.body.away_team}','${req.body.stadium}', '${req.body.referee}')`
        );
        res.status(201).send("game added");
    } catch (error) {
        error.message = "couldn't add game";
        error.status = 400;
        next(error);
    }
});


router.put("/updateGame/:gameId", async(req, res, next) => {
    try {
        if (req.body.score === undefined)
            throw { status: 401, message: "No score provided" }
            // check if game exists
        const rowExists = await DButils.execQuery(`if exists (select * from dbo.games where game_id = '${req.params.gameId}') 
        select 'True'  
        else 
        select 'False' 
        return`);
        if (rowExists[0][""] === 'False')
            throw { status: 401, message: "No such game" }
        await DButils.execQuery(`update dbo.games set score = '${req.body.score}' where game_id = '${req.params.gameId}'`);
        res.status(201).send("game updated");
    } catch (error) {
        next(error);
    }
});

router.post("/insertActivity", async(req, res, next) => {
    try {
        await DButils.execQuery(`insert into dbo.game_activity (game_id, date, time, minute, event_type, player_name1, player_name2) VALUES (
            '${req.body.gameId}', '${req.body.date}','${req.body.time}', '${req.body.minute}','${req.body.event_type}', '${req.body.player_name1}', '${req.body.player_name2}') `);
        res.status(201).send("activity added");

    } catch (error) {
        res.status(400).send("couldnt insert activity");
    }
});


module.exports = router;