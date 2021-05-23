const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;

async function getLeagueDetails() {
    const league = await axios.get(
        `${api_domain}/leagues/${LEAGUE_ID}`, {
            params: {
                include: "season",
                api_token: process.env.api_token,
            },
        }
    );
    const stage = await axios.get(
        `${api_domain}/stages/${league.data.data.current_stage_id}`, {
            params: {
                api_token: process.env.api_token,
            },
        }
    );
    return {
        league_name: league.data.data.name,
        current_season_name: league.data.data.season.data.name,
        current_stage_name: stage.data.data.name,
        // next game details should come from DB
    };
}

async function getNextGame() {
    next_game = DButils.execQuery("SELECT * FROM games order by date,time desc limit 1")
}

async function getLeagueGames() {

}
exports.getLeagueDetails = getLeagueDetails;