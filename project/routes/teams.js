var express = require("express");
const { route } = require("./league");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");

// router.get("/teamFullDetails/:teamId", async(req, res, next) => {
//     try {
//         const team_details = await players_utils.getPlayersByTeam(
//             req.params.teamId
//         );
//         //we should keep implementing team page.....
//         res.send(team_details);
//     } catch (error) {
//         next(error);
//     }
// });

router.get("/teamSearch/:teamName", async(req, res, next) => {
    try {
        // get all id that match the teamName
        const teams_details = await teams_utils.searchTeamsByName(req.params.teamName);
        if(teams_details.length === 0)
            throw { status: 400, message: "No such team name"}        
        res.send(teams_details);
    } catch (error) {
        next(error);
    }
})

router.get("/getTeamById/:teamId", async(req, res, next) => {
    try {
        // get all id that match the teamName
        const teams_details = await teams_utils.getTeamById(req.params.teamId);
        res.send(teams_details);
    } catch (error) {
        error.message = "No such team ID";
        error.status = 400;
        next(error);
    }
})

router.get("/getTeamFullData/:teamId", async(req, res, next) => {
    try {
        // get all id that match the teamName
        const teams_details = await teams_utils.getTeamFullData(req.params.teamId);
        teams_details.players = await players_utils.getPlayersByTeam(
            req.params.teamId
        );
        res.send(teams_details);
    } catch (error) {
        error.message = "No such team ID";
        error.status = 400;
        next(error);
    }
})

module.exports = router;