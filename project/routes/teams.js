var express = require("express");
const { route } = require("./league");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/teamFullDetails/:teamId", async(req, res, next) => {
    try {
        const team_details = await players_utils.getPlayersByTeam(
            req.params.teamId
        );
        //we should keep implementing team page.....
        res.send(team_details);
    } catch (error) {
        next(error);
    }
});

router.get("/teamSearch/:teamName", async(req, res, next) => {
    try {
        // get all id that match the teamName
        const match_team_id = await teams_utils.findMatchTeams(req.params.teamName);
        const teams_details = await teams_utils.getTeamsInfo(match_team_id);
        res.send(teams_details);
    } catch (error) {
        next(error);
    }
})

module.exports = router;