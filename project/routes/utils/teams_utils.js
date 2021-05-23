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

async function getTeamFullData(team_id){
    const team_info = await axios.get(`${api_domain}/teams/${id}`, {
        params: {
            include: ["latest","upcoming"],
            api_token: process.env.api_token,
        },
    });
    team_info = team_info.data.data;
    return extractFullTeamData(team_info);
}

async function getTeamById(team_id){
    let promises = [];
    team_id.map((id) =>
        promises.push(
            axios.get(`${api_domain}/teams/${id}`, {
                params: {
                    api_token: process.env.api_token,
                },
            })
        )
    );
    let teams_info = await Promise.all(promises);

    //decapsulate data
    teams_info = teams_info.map((team) => {
        return team.data.data;
        }
    );
    return extractReleventTeamData(teams_info);
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

function extractFullTeamData(team_info){
    const {id, name, short_code, founded, logo_path} = team_info;
    return {
        id: id,
        name: name,
        short_name: short_code,
        foundation: founded,
        logo: logo_path,
        past_fixures: extractPastFixtures(team_info.latest.data),
        future_fixtures: extractFutureFixtures(team_info.upcoming.data),
    };

}

function extractPastFixtures(past_fixures){
    return past_fixures.map((past_fixure) => {
        const {localteam_id, visitorteam_id, round_id, winner_team_id} = past_fixure;
        const {localteam_score, visitorteam_score, ht_score} = past_fixure.scores;
        const {date, time} = past_fixure.time.starting_at;
        const {localteam_formation, visitorteam_formation} = past_fixure.formations;
        const {localteam_position, visitorteam_position} = past_fixure.standings;
        const home_color = past_fixure.colors.localteam.color;
        const away_color = past_fixure.colors.visitorteam.color;
        return { 
            home_team: getTeamById(localteam_id),
            away_team: getTeamById(visitorteam_id),
            // round_id = get_round
            winner: (winner_team_id == localteam_id) ? home_team : away_team,
            home_score: localteam_score,
            away_score: visitorteam_score,
            ht_score: ht_score,
            date: date,
            time: time,
            home_formation: localteam_formation,
            away_formation: visitorteam_formation,
            home_position: localteam_position,
            away_position: visitorteam_position,
            home_color: home_color,
            away_color: away_color,
        };
    });   
}

function extractFutureFixtures(future_fixures){
    return future_fixures.map((future_fixure) => {
        const {localteam_id, visitorteam_id, round_id, winner_team_id} = future_fixure;
        const {date, time} = future_fixure.time.starting_at;
        const {localteam_position, visitorteam_position} = future_fixure.standings;
        return { 
            home_team: getTeamById(localteam_id),
            away_team: getTeamById(visitorteam_id),
            // round_id = get_round
            date: date,
            time: time,
            home_position: localteam_position,
            away_position: visitorteam_position,
        };
    });   
}


exports.isSuperligaTeam = isSuperligaTeam;
exports.searchTeamsByName = searchTeamsByName;
exports.getTeamById = getTeamById;
exports.getTeamFullData = getTeamFullData;