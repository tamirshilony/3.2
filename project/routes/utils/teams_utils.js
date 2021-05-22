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
    // get all teams match to team_name
    const teams_least = await axios.get(`${api_domain}/teams/search/${team_name}`, {
        params: {
            include: "league",
            api_token: process.env.api_token,
        },
    });
    // find only teams in superliga
    for(let i = 0; i < teams_least.data.data.length; i++){
        if(teams_least.data.data[i].league.data.id == LEAGUE_ID){
            relevent_teams.push(teams_least.data.data[i]);
        }
    }
    return extractReleventTeamData(relevent_teams);
}


function extractReleventTeamData(teams_least) {
    return teams_least.map((team) => {
        const {id, name, logo_path } = team;
        return {
            id: id,
            name: name,
            logo: logo_path,
        };
    });
}

exports.isSuperligaTeam = isSuperligaTeam;
exports.searchTeamsByName = searchTeamsByName;