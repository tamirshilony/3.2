var express = require("express");
const { route } = require("./league");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/teamFullDetails/:teamId", async(req, res, next) => {
    let team_details = [];
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

router.get("/teamSearch/:teamName", async(req, res, next ) => {
  
})

module.exports = router;