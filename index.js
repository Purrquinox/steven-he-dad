// Packages
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});
const database = require("./database/mongo");
const words = require("./words.json");
const logger = require("./logger");
require("dotenv").config();

// Discord Ready Event
client.once("ready", () => {
	// Set Activity
	client.user.setActivity(`all failures`, {
		type: ActivityType.Watching,
	});

	client.user.setStatus("idle");

    logger.success("Discord", "Connected!");
});

// Discord Debug Event
client.on("debug", (info) => {
    logger.info("Discord Debug", info);
});

// Discord Error Event
client.on("error", (error) => {
    logger.error("Discord", info);
});

// Discord Server Message Event
client.on("messageCreate", (message) => {
	// Block Bots
	if (message.author.bot || message.author.system) return;

	// Automatic Bot Replies
	const content = message.content.toLowerCase();
	let matchFound = false;

	content.split(" ").forEach((word) => {
		if (matchFound) return;

		const match = words[word];

		if (!match) return;
		else {
			message.reply(match);
			matchFound = true;
		}
	});
});

// Discord Server Member Join Event
client.on("guildMemberAdd", (member) => {
	client.channels.cache
		.get("1005175177161752636")
		.send(
			`https://tenor.com/view/steven-he-welcome-to-the-failure-gif-24563965`
		);
	client.channels.cache.get("1005175177161752636").send(`<@${member.id}>`);

	// Assign failure role (if exists)
	let role = member.guild.roles.cache.find((r) => r.name == "failures");
	if (!role) return;
	member.roles.add(role);
});

// Discord Server Member Leave Event
client.on("guildMemberRemove", (member) => {
    client.channels.cache.get("1005175177161752636").send(`${member.username}#${member.discriminator} has left the server!`);
});

// Login to Discord
client.login(process.env.TOKEN);
