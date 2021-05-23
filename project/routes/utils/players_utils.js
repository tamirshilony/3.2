const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const teams_utils = require("./teams_utils");
// const TEAM_ID = "85";

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

async function infoById(id) {
    // get the player info 
    let info = await axios.get(`${api_domain}/players/${id}`, {
        params: {
            include: "team",
            api_token: process.env.api_token,
        },
    });
    return info;
}

async function getPlayerIdsByName(player_name) {
    let players_ids_list = [];
    let promises = [];
    let player_list = [];
    // get all plyers match to player_name
    const candidates_players = await axios.get(`${api_domain}/players/search/${player_name}`, {
        params: {
            api_token: process.env.api_token,
            include: "team",
        },
    });
    // loop over all candidates_players
    candidates_players.data.data.map((player) =>
        promises.push(
            teams_utils.isSuperligaTeam(player.team_id)
        )
    );
    players_ids_list = await Promise.all(promises);
    for (let i = 0; i < players_ids_list.length; i++) {
        if (players_ids_list[i])
            player_list.push(candidates_players.data.data[i]);
    }
    return player_list;
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
        const { player_id, fullname, image_path, position_id } = player_info.data.data;
        const { name } = player_info.data.data.team.data;
        return {
            id: player_id,
            name: fullname,
            image: image_path,
            position: position_id,
            team_name: name,
        };
    });
}

function extractAllPlayerinfo(player_info) {
    const { player_id, fullname, image_path, position_id, common_name, nationality, birthdate, birthcountry, height, weight } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
        id: player_id,
        name: fullname,
        image: image_path,
        position: position_id,
        team_name: name,
        common_name: common_name,
        nationality: nationality,
        birthdate: birthdate,
        birthcountry: birthcountry,
        height: height,
        weight: weight

    };

}

function extractRelevantPlayerinfo(players_info) {
    return players_info.map((player_info) => {
        const { player_id, fullname, image_path, position_id } = player_info;
        const { name } = player_info.team.data;
        return {
            id: player_id,
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
    return extractRelevantPlayerinfo(match_players_id);
}

async function getPlayerCard(id) {
    player_info = await infoById(id);
    return extractAllPlayerinfo(player_info);
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.findMatchPlayers = findMatchPlayers;
exports.getPlayerCard = getPlayerCard;