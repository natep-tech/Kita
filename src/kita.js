/**
 * Kita Social Media Embedder Bot
 * (c) 2023 natep-tech
 */

// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config();

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
	],
});

const eventsPath = path.join(__dirname, 'listeners');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);