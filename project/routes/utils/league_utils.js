const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;
const DButils = require("./DButils");

async function getLeagueDetails() {
    const league = await axios.get(
        `${api_domain}/leagues/${LEAGUE_ID}`, {
            params: {
                include: "season",
                api_token: process.env.api_token,
            },
        }
    );
    if (league.data.data.current_stage_id === null)
        stage_id = "TBD";
    else {
        const stage = await axios.get(
            `${api_domain}/stages/${league.data.data.current_stage_id}`, {
                params: {
                    api_token: process.env.api_token,
                },
            }
        );
        stage_id = stage.data.data.name;
    }
    try {
        const game = (await DButils.execQuery("SELECT top 1 date,time,home_team,away_team,stadium,referee FROM games where date >=CAST(GETDATE() AS DATE) and time > CAST(GETDATE() AS TIME) order by date,time asc"));

        return {
            league_name: league.data.data.name,
            current_season_name: league.data.data.season.data.name,
            current_stage_name: stage_id,
            next_game: game
        };
    } catch (error) {
        next(error);
    }
}


async function getLeagueGames() {
    try {
        const table_game = (await DButils.execQuery("select * from games"));
        return table_game;
    } catch (error) {
        return null
    }
}


async function sortLeagueGames(value) {
    try {
        const results = {};
        results.game = (await DButils.execQuery(`select * FROM games order by '${value}'asc`));
        results.activity = await DButils.execQuery("select * from dbo.game_activity order by game_id");
        return results;
    } catch (error) {
        return null
    }
}

exports.getLeagueDetails = getLeagueDetails;
exports.getLeagueGames = getLeagueGames;
exports.sortLeagueGames = sortLeagueGames;
