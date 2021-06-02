var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");

router.use(async function(req, res, next) {
    // check if user is login
    if (!req.session.user_id) {
        res.status(401).send("Log in is require");
    } else {
        next();
    }
});

router.post("/addGame", async(req, res, next) => {
    try {
        // check if already has Favorites tables
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

module.exports = router;