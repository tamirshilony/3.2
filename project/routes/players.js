var express = require("express");
const { route } = require("./leagueManagement");
var router = express.Router();
const players_utils = require("./utils/players_utils");

router.get("/playerDetails/:playerId", async(req, res, next) => {
    try {
        const player_details = await players_utils.getPlayerCard(req.params.playerId);
        res.send(player_details);
    } catch (error) {
        error.message = "No such player ID";
        error.status = 400;
        next(error);
    }
});

router.use("/playerSearch/:playerName", async function(req, res, next) {
    let fillter_position = req.query.position;
    let fillter_team = req.query.team_name;
    if (fillter_position === undefined & fillter_team === undefined) {
        next();
    } else {
        try {
            // get all require info about players that match the playerName
            const players_details = await players_utils.findMatchPlayers(req.params.playerName);
            // get the position number and team name fiilter
            let fillter_players_details = [];
            // fiilter the data by position if needed
            if (fillter_position != undefined) {
                for (let i = 0; i < players_details.length; i++) {
                    if (players_details[i].position === parseInt(fillter_position))
                        fillter_players_details.push(players_details[i]);
                }
            }
            if (fillter_players_details.length != 0) {
                // fiilter the fillter data by team name if needed
                if (fillter_team != undefined) {
                    for (let i = 0; i < fillter_players_details.length; i++) {
                        if (fillter_players_details[i].team_name != fillter_team) {
                            fillter_players_details.splice(i, 1);
                        }
                    }
                }
            } else {
                // fiilter the  data by team name if needed
                if (fillter_team != undefined) {
                    for (let i = 0; i < players_details.length; i++) {
                        if (players_details[i].team_name != fillter_team)
                            fillter_players_details.push(players_details[i]);
                    }
                }
            }
            // checking if there are results
            if (fillter_players_details.length === 0)
                res.status(201).send("no match results");
            else
                res.send(fillter_players_details);
        } catch (error) {
            next(error);
        }

    }
});

router.get("/playerSearch/:playerName", async(req, res, next) => {
    try {
        // get all require info about players that match the playerName
        const fillter_players_details = await players_utils.findMatchPlayers(req.params.playerName);
        if (fillter_players_details.length === 0)
            res.status(201).send("no match results")
        res.send(fillter_players_details);
    } catch (error) {
        next(error);
    }
});



module.exports = router;