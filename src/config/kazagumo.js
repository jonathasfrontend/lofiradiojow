const { Kazagumo, Plugins } = require("kazagumo");
const Spotify = require("kazagumo-spotify");
const shoukakuOptions = require("../utils/options");
const { Connectors } = require("shoukaku");
const { client } = require('../Client');
require('dotenv').config();

function parseBoolean(value) {
    if (typeof value === 'string') {
        value = value.trim().toLowerCase();
    }
    return value === true || value === "true";
}

const nodes = [
    {
        name: "LavalinkLoFiRadio",
        url: process.env.NODE_URL || 'lavalink.jirayu.net:13592', 
        auth: process.env.NODE_AUTH || 'youshallnotpass',
        secure: parseBoolean(process.env.NODE_SECURE || 'false'),
    },
];

// Criamos a instância do Kazagumo com 'new'
const kazagumoInstance = new Kazagumo(
    {
        plugins: [
            new Spotify({
                clientId: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
                playlistPageLimit: 3, // limite de páginas para playlists
                albumPageLimit: 4,    // limite de páginas para álbuns
                searchLimit: 10,      // limite de resultados na busca
                searchMarket: 'BR',   // mercado de busca (Brasil)
            }),
            new Plugins.PlayerMoved(client), // Plugin para gerenciar movimento do player
        ],
        defaultSearchEngine: "spotify", // Define YouTube como busca padrão
        send: (guildId, payload) => {
            const guild = client.guilds.cache.get(guildId);
            if (guild) guild.shard.send(payload); // Envia payloads para o Discord
        },
    },
    new Connectors.DiscordJS(client),
    nodes, // Lista de nós do Lavalink
    shoukakuOptions, // Conector para o Discord.js
);
// Exportamos a instância para usar em outros arquivos
module.exports = { kazagumoInstance };