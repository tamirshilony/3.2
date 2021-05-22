const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;

async function isSuperligaTeam(id) {
    const team = await axios.get(`${api_domain}/teams/${id}`, {
        params: {
            include: "league",
            api_token: process.env.api_token,
        },
    });
    return team.data.data.league.data.id == LEAGUE_ID;
}

async function searchTeamsByName(team_name) {
    let relevent_teams = [];
    const teams_least = await axios.get(`${api_domain}/teams/search/${team_name}`, {
        params: {
            include: "league",
            api_token: process.env.api_token,
        },
    });
    teams_least.data.data.map(async function(team){
        if (team.league.data.id === LEAGUE_ID)
            return team
    });
    return extractReleventTeamData(relevent_teams);
}


function extractReleventTeamData(teams_least) {
    return teams_least.map((team) => {
        const { name, logo_path } = team.data;
        return {
            name: name,
            logo: logo_path,
        };
    });
}

exports.isSuperligaTeam = isSuperligaTeam;
exports.searchTeamsByName = searchTeamsByName;