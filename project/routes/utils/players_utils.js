const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
<<<<<<< HEAD
// const TEAM_ID = "85";

// async function getPlayerFullDetailsById(player_id){
//     const player_info = axios.get(`${api_domain}/players/${id}`, {
//         params: {
//             api_token: process.env.api_token,
//         },
//     })
// }
=======
const teams_utils = require("./utils/teams_utils");
// const TEAM_ID = "85";
>>>>>>> 61596494384c5368e1a2c3e38b2e5e0c15addc67

async function getPlayerIdsByTeam(team_id) {
    let player_ids_list = [];
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
            include: "squad",
            api_token: process.env.api_token,
        },
    });
    team.data.data.squad.data.map((player) =>
        player_ids_list.push(player.player_id)
    );
    return player_ids_list;
}

async function getPlayerIdsByName(player_name) {
    let player_ids_list = [];
    // get all plyers match to player_name
    const candidates_players = await axios.get(`${api_domain}players/search/${player_name}`, {
        params: {
            api_token: process.env.api_token,
        },
    });
    // loop over all candidates_players
    candidates_players.data.data.map((players) => {
        // check if the player is in superliga
        if (teams_utils.isSuperligaTeam(players.team_id)) {
            player_ids_list.push(players.player_id)
        }
    });
    return player_ids_list;
}

async function getPlayersInfo(players_ids_list) {
    let promises = [];
    players_ids_list.map((id) =>
        promises.push(
            axios.get(`${api_domain}/players/${id}`, {
                params: {
                    api_token: process.env.api_token,
                    include: "team",
                },
            })
        )
    );
    let players_info = await Promise.all(promises);
    return extractRelevantPlayerData(players_info);
}

function extractRelevantPlayerData(players_info) {
    return players_info.map((player_info) => {
        const { fullname, image_path, position_id } = player_info.data.data;
        const { name } = player_info.data.data.team.data;
        return {
            name: fullname,
            image: image_path,
            position: position_id,
            team_name: name,
        };
    });
}

async function getPlayersByTeam(team_id) {
    let player_ids_list = await getPlayerIdsByTeam(team_id);
    let players_info = await getPlayersInfo(player_ids_list);
    return players_info;
}

async function findMatchPlayers(player_name) {
    let match_players_id = await getPlayerIdsByName(player_name);
    return match_players_id;
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.findMatchPlayers = findMatchPlayers;