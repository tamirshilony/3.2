var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function(req, res, next) {
    if (req.session && req.session.user_id) {
        DButils.execQuery("SELECT user_id FROM users")
            .then((users) => {
                if (users.find((x) => x.user_id === req.session.user_id)) {
                    req.user_id = req.session.user_id;
                    next();
                }
            })
            .catch((err) => next(err));
    } else {
        res.status(401).send("Login is require");
    }
});

/**
 * This path gets body with playerId and save this player in the favorites list of the logged-in user
 */
router.post("/favoritePlayers", async(req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const player_id = req.body.playerId;
        await users_utils.markPlayerAsFavorite(user_id, player_id);
        res.status(201).send("The player successfully saved as favorite");
    } catch (error) {
        next(error);
    }
});

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/favoritePlayers", async(req, res, next) => {
    try {
        const user_id = req.session.user_id;
        let favorite_players = {};
        const player_ids = await users_utils.getFavoritePlayers(user_id);
        let player_ids_array = [];
        player_ids.map((element) => player_ids_array.push(element.player_id)); //extracting the players ids into array
        const results = await players_utils.getPlayersInfo(player_ids_array);
        res.status(200).send(results);
    } catch (error) {
        next(error);
    }
});

/**
 * This path gets body with teamId and save this team in the favorites list of the logged-in user
 */

router.post("/favoriteTeams", async(req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const team_id = req.body.team_id;
        await users_utils.markTeamAsFavorite(user_id, team_id);
        res.status(201).send("The team successfully saved as favorite");
    } catch (error) {
        next(error);
    }
});

/**
 * This path returns the favorites teams that were saved by the logged-in user
 */
router.get("/favoriteTeams", async(req, res, next) => {
    try {
        const user_id = req.session.user_id;
        let favorite_teams = {};
        const teams_ids = await users_utils.getFavoriteTeams(user_id);
        let teams_ids_array = [];
        teams_ids.map((element) => teams_ids_array.push(element.team_id)); //extracting the teams ids into array
        const results = await teams_utils.getTeamsByIds(teams_ids_array);
        res.status(200).send(results);
    } catch (error) {
        next(error);
    }
});

/**
 * This path gets body with gameId and save this game in the favorites list of the logged-in user
 */

router.post("/favoriteGames", async(req, res, next) => {
    try {
        const user_id = req.session.user_id;
        const game_id = req.body.game_id;
        await users_utils.markGameAsFavorite(user_id, game_id);
        res.status(201).send("The game successfully saved as favorite");
    } catch (error) {
        next(error);
    }
});

/**
 * This path returns the favorites games that were saved by the logged-in user
 */
router.get("/favoriteGames", async(req, res, next) => {
    try {
        const user_id = req.session.user_id;
        let favorite_games = {};
        const games_ids = await users_utils.getFavoriteGamesId(user_id);
        let games_ids_array = [];
        games_ids.map((element) => games_ids_array.push(element.game_id)); //extracting the games ids into array
        let game_id_list = games_ids_array.map(function(a) { return "'" + a + "'"; }).join(","); // make it list for query
        const results = await users_utils.getFavoriteGames(game_id_list);
        res.status(200).send(results);
    } catch (error) {
        next(error);
    }
});


module.exports = router;