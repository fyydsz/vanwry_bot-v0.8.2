
// credentials are optional
const express = require('express')
const app = express()

const { QuickDB } = require("quick.db")
const db = new QuickDB()

var SpotifyWebApi = require('spotify-web-api-node');

// This file is copied from: https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js

const scopes = [
	'ugc-image-upload',
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'streaming',
	'app-remote-control',
	'user-read-email',
	'user-read-private',
	'playlist-read-collaborative',
	'playlist-modify-public',
	'playlist-read-private',
	'playlist-modify-private',
	'user-library-modify',
	'user-library-read',
	'user-top-read',
	'user-read-playback-position',
	'user-read-recently-played',
	'user-follow-read',
	'user-follow-modify'
];


let spotifyApi = new SpotifyWebApi({
	clientId: process.env.spotifyClient,
	clientSecret: process.env.spotifyClientSecret,
	redirectUri: process.env.redirectUri
});

const spotifyToken = db.table("spotifyToken")
const spotifyRefreshToken = db.table("spotifyRefreshToken")

app.get('/login', (req, res) => {
	res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get("/callback", (req, res) => {
	const error = req.query.error;
	const code = req.query.code;
	const state = req.query.state;

	if (error) {
		console.error("Callback Error:", error);
		res.send(`Callback Error: ${error}`);
		return;
	}
	spotifyApi
		.authorizationCodeGrant(code)
		.then((data) => {
			const access_token = data.body["access_token"];
			const refresh_token = data.body["refresh_token"];
			const expires_in = data.body["expires_in"];

			spotifyApi.setAccessToken(access_token);
			spotifyApi.setRefreshToken(refresh_token);

			spotifyRefreshToken.set("spotifyRefreshToken", refresh_token)
			spotifyToken.set("spotifyToken", access_token)

			console.log("access_token:", access_token);
			console.log("refresh_token:", refresh_token);

			console.log(
				`Sucessfully retreived access token. Expires in ${expires_in} s.`
			);
			res.send("Success! You can now close the window.");

			setInterval(async () => {
				const data = await spotifyApi.refreshAccessToken();
				const access_token = data.body["access_token"];

				spotifyToken.set("spotifyToken", access_token)

				console.log("The access token has been refreshed!");
				console.log("access_token:", access_token);

				spotifyApi.setAccessToken(access_token);
			}, 1800000);
		})
		.catch((error) => {
			console.error("Error getting Tokens:", error);
			res.send(`Error getting Tokens: ${error}`);
		});
});

setInterval(async () => {

	let spotifyApi = new SpotifyWebApi({
		clientId: process.env.spotifyClient,
		clientSecret: process.env.spotifyClientSecret,
	})

	let spotifyToken = db.table("spotifyToken")
	let spotifyRefreshToken = db.table("spotifyRefreshToken")
	let token = await spotifyToken.get("spotifyToken")
	let refreshToken = await spotifyRefreshToken.get("spotifyRefreshToken")

	spotifyApi.setAccessToken(token)
	spotifyApi.setRefreshToken(refreshToken)

	const refresh = await spotifyApi.refreshAccessToken();
	const access_token = refresh.body["access_token"];

	console.log("The spotify access token has been refreshed!");

	spotifyToken.set("spotifyToken", access_token)
	spotifyApi.setAccessToken(access_token);
}, 300000);

setInterval(async () => {
	console.log("Interval trigger successfully.")
}, 180000)

app.get('/', (req, res) => {
	res.send('Server is up.')
	console.log("Google trigger successfully.")
});



app.listen(8888, () => {
	console.log(`Ping telah diterima`)
})


// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require("fs")
const path = require("node:path")
const { client_id, guild_id, prefix } = require("./config.json")

const token = process.env.TOKEN

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildPresences
	]
});


// Event handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync("./events")
	.filter((file) => file.endsWith(".js"));


for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args))
	} else {
		client.on(event.name, (...args) => event.execute(...args))
	}
}


// Collection commands
client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection()
client.cooldowns = new Collection()
client.triggers = new Collection()

// Slash command
const slashCommands = fs.readdirSync("./commands");
for (const module of slashCommands) {
	const commandFiles = fs
		.readdirSync(`./commands/${module}`)
		.filter((file) => file.endsWith(".js"));

	for (const commandFile of commandFiles) {
		const command = require(`./commands/${module}/${commandFile}`);
		if ('data' in command && 'execute' in command) {
			client.slashCommands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${commandFile} is missing a required "data" or "execute" property.`);
		}
	}
}


const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const commandJsonData = [
	...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
	//...Array.from(client.contextCommands.values()).map((c) => c.data),
];

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(
			Routes.applicationGuildCommands(client_id, guild_id),
			{ body: commandJsonData }
		);

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();



// Mendandakan bot sudah ready / online
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	c.user.setPresence({ activities: [{ name: `/dabloons` }], status: 'idle' })
});

// Log in to Discord with your client's token
client.login(token);