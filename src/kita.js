/* eslint-disable no-inline-comments */
/**
 * Kita Social Media Embedder Bot
 * (c) 2023 natep-tech
 */

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const ALLOWED_DOMAINS = ['https://www.instagram.com', 'https://www.tiktok.com', 'https://x.com', 'https://twitter.com', 'https://www.reddit.com', 'https://old.reddit.com'];
const EMBED_DOMAINS = ['https://ddinstagram.com', 'https://vxtiktok.com', 'https://fixvx.com', 'https://vxtwitter.com', 'https://vxreddit.com', 'https://vxreddit.com'];

require('dotenv').config();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;

	// Check if the message contains any of the allowed domains, then repost it with the embed domains
	if (ALLOWED_DOMAINS.some(d => message.content.includes(d))) {
		try {
			const userId = message.author.id;
			const messageContent = `*From <@${userId}>:* \n${replaceDomains(message.content)}`;

			// Send the message without pinging the user
			await message.channel.send({
				content: messageContent,
				allowedMentions: { users: [] }, // This prevents any pings from being sent
				files: message.attachments.map(attachment => attachment.url),
			});
			await message.delete();
			console.log(`Successfully reposted URL: ${message.content} from ${message.author.username}`);
		}
		catch (error) {
			console.error('Error reposting URL:', error);
			message.reply('Sorry, there was an error reposting the URL.');
		}
	}

	// info command
	if (message.content === '!info') {
		message.channel.send('Kita Social Media Embedder Bot\n(c) 2023 natep-tech\n\nThis bot reposts messages containing certain social media site URLs with embed URLs to fix generated embeds so media is displayed properly. Supports these websites:\n- Instagram --> [ddinstagram.com](https://ddinstagram.com)\n- TikTok --> [vxtiktok.com](https://vxtiktok.com)\n- Twitter (X) --> [vxtwitter.com](https://vxtwitter.com)\n- Reddit (Old & New) --> [vxreddit.com](https://vxreddit.com)\n\nPlease do not abuse this bot.');
	}

});

function replaceDomains(inputString) {
	// Iterate over each domain in ALLOWED_DOMAINS
	for (let i = 0; i < ALLOWED_DOMAINS.length; i++) {
		const domain = ALLOWED_DOMAINS[i];
		const embedDomain = EMBED_DOMAINS[i];

		// Check if the input string contains the domain
		if (inputString.includes(domain)) {
			// Replace the domain with the corresponding embed domain
			inputString = inputString.replace(new RegExp(domain, 'g'), embedDomain);
		}
	}

	return inputString;
}

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

