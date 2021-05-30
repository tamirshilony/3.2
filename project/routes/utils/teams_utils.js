const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;
const SEASON_ID = 17328;

async function isSuperligaTeam(id) {
    if(id){
        const team = await axios.get(`${api_domain}/teams/${id}`, {
            params: {
                include: "league",
                api_token: process.env.api_token,
            },
        });
        if(team.data.data.league !== undefined)
            return team.data.data.league.data.id == LEAGUE_ID;
    }
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
        if(teams_least.data.data[i].league !== undefined && teams_least.data.data[i].league.data.id == LEAGUE_ID){
            relevent_teams.push(teams_least.data.data[i]);
        }
    }

    return relevent_teams.map(team => extractReleventTeamData(team));
}

async function getTeamFullData(team_id){
    let team_info = await axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
            include: "latest,upcoming",
            api_token: process.env.api_token,
        },
    });
    team_info = team_info.data.data;
    return await extractFullTeamData(team_info);
}

async function getTeamById(team_id){
    let team_info = await axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
            api_token: process.env.api_token,
        },
    });
    //decapsulate data
    team_info = team_info.data.data;
    return extractReleventTeamData(team_info);
}

async function getRoundNameById(round_id){
    const round_info = await axios.get(`${api_domain}/rounds/${round_id}`, {
        params: {
            api_token: process.env.api_token,
        },
    });
    return round_info.data.data.name;
}

function extractReleventTeamData(team) {
    const {id, name, logo_path } = team;
    return {
        id: id,
        name: name,
        logo: logo_path,
        };
}

async function extractFullTeamData(team_info){
    let past_promises = [];
    let future_promises = [];
    const {id, name, short_code, founded, logo_path} = team_info;
    team_info.latest.data.filter(future_fixure => 
        future_fixure.season_id == SEASON_ID).map((past_fixure) => 
            past_promises.push(
                extractTeamPastFixtures(past_fixure)
            )
        );
    team_info.upcoming.data.map(future_fixure =>
        future_promises.push(
            extractTeamFutureFixtures(future_fixure)
        )
    )
    const past_fixures = await Promise.all(past_promises);
    const future_fixtures = await Promise.all(future_promises);
    return {
        id: id,
        name: name,
        short_name: short_code,
        foundation: founded,
        logo: logo_path,
        past_fixures: past_fixures,
        future_fixtures: future_fixtures,
    };
}

async function extractTeamPastFixtures(past_fixure){
    const {localteam_id, visitorteam_id, round_id, winner_team_id} = past_fixure;
    const {localteam_score, visitorteam_score, ht_score} = past_fixure.scores;
    const {date, time} = past_fixure.time.starting_at;
    const {localteam_formation, visitorteam_formation} = past_fixure.formations;
    const {localteam_position, visitorteam_position} = past_fixure.standings;
    const home_color = past_fixure.colors.localteam.color;
    const away_color = past_fixure.colors.visitorteam.color;
    const home_team = await getTeamById(localteam_id);
    const away_team = await getTeamById(visitorteam_id);
    const round_name = await getRoundNameById(round_id);
    return { 
        home_team: home_team,
        away_team: away_team,
        round_name: round_name,
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
}

async function extractTeamFutureFixtures(future_fixure){
    const {localteam_id, visitorteam_id, round_id} = future_fixure;
    const {date, time} = future_fixure.time.starting_at;
    const {localteam_position, visitorteam_position} = future_fixure.standings;
    const home_team = await getTeamById(localteam_id);
    const away_team = await getTeamById(visitorteam_id);
    const round_name = await getRoundNameById(round_id);
    return { 
        home_team: home_team,
        away_team: away_team,
        round_name: round_name,
        date: date,
        time: time,
        home_position: localteam_position,
        away_position: visitorteam_position,
    };
}

exports.isSuperligaTeam = isSuperligaTeam;
exports.searchTeamsByName = searchTeamsByName;
exports.getTeamById = getTeamById;
exports.getTeamFullData = getTeamFullData;