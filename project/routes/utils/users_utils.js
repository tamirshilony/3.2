const DButils = require("./DButils");

async function markPlayerAsFavorite(user_id, player_id) {
    await DButils.execQuery(
        `insert into favorite_players values ('${user_id}',${player_id})`
    );
}

async function getFavoritePlayers(user_id) {
    const player_ids = await DButils.execQuery(
        `select player_id from favorite_players where user_id='${user_id}'`
    );
    return player_ids;
}

async function markTeamAsFavorite(user_id, team_id) {
    await DButils.execQuery(
        `insert into favorite_teams values ('${user_id}',${team_id})`
    );
}

async function getFavoriteTeams(user_id) {
    const teams_ids = await DButils.execQuery(
        `select team_id from favorite_teams where user_id='${user_id}'`
    );
    return teams_ids;
}

async function markGameAsFavorite(user_id, game_id) {
    await DButils.execQuery(
        `insert into favorite_games values ('${user_id}',${game_id})`
    );
}

async function getFavoriteGamesId(user_id) {
    const games_ids = await DButils.execQuery(
        `select game_id from favorite_games where user_id='${user_id}'`
    );
    return games_ids;
}

async function getFavoriteGames(games_ids) {
    const games_details = await DButils.execQuery(
        `select date,time,home_team,away_team,stadium,referee from games where game_id in (${games_ids}) `
    );
    return games_details;
}


exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
exports.markTeamAsFavorite = markTeamAsFavorite;
exports.getFavoriteTeams = getFavoriteTeams;
exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGamesId = getFavoriteGamesId;
exports.getFavoriteGames = getFavoriteGames;