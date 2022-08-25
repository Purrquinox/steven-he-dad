// Packages
const {
	Client,
	GatewayIntentBits,
	ActivityType,
	codeBlock,
} = require("discord.js");
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
	],
});
const fs = require("node:fs");
const database = require("./database/handler");
const { words, memes, level_roles } = require("./data.json");
const logger = require("./logger");
const moment = require("moment");
require("dotenv").config();

// Discord Ready Event
client.once("ready", () => {
	if (process.env.NODE_ENV === "production") {
		client.user.setActivity(`all failures`, {
			type: ActivityType.Watching,
		});

		client.user.setStatus("idle");
	} else client.user.setStatus("dnd");

	logger.success("Discord", "Connected!");
});

// Discord Debug Event
client.on("debug", (info) => {
	logger.info("Discord Debug", info);
});

// Discord Error Event
client.on("error", (error) => {
	logger.error("Discord Error", error);
});

// Commands
client.commands = new Map();
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// Discord Server Message Event
client.on("messageCreate", async (message) => {
	// Block Bots
	if (message.author.bot || message.author.system) return;

	// Block DMs
	if (message.channel.type === "dm") return;

	// Get Message Author from Database
	const user = await database.User.getUser(
		message.author.id,
		message.guild.id
	);

	// Add Message Author to Database (if not already in database)
	if (!user) {
		database.User.createUser(message.author.id, message.guild.id, 0);

		message.author
			.send({
				content: `Hello fellow failure, thanks for sending your first message in **${message.guild.name}**. You can now earn xp by being active here, and you can always track your xp by doing \`${process.env.PREFIX}level\`.`,
			})
			.catch((error) => {
				message.reply({
					content: `Hello fellow failure, thanks for sending your first message in **${message.guild.name}**. You can now earn xp by being active here, and you can always track your xp by doing \`${process.env.PREFIX}level\`.`,
				});
			});
	}

	// Leveling System
	if (user) {
		// Variables
		let level = user.levels.level;
		let xp = user.levels.xp;
		let xp_to_next_level = user.levels.xp_to_next_level;
		let currentDate = moment().diff(
			moment(user.levels.lastXPUpdate),
			"days"
		);

		// If the user's last XP update was 1 day ago or more, randomize the xp
		if (currentDate >= 1) {
			xp = Math.floor(Math.random() * 10) + 1;

			message.reply({
				content: `Congrats!\nYou have won the Daily Double, and now have ${xp} XP.`,
			});
		} else xp = xp + 1;

		// Check if the new XP is above the XP needed for the next level
		if (xp >= xp_to_next_level) {
			// Add 1 to the user's level
			level = level + 1;

			// Reset the user's XP to 0
			xp = xp - xp_to_next_level;

			// Calculate the XP needed for the next level
			xp_to_next_level =
				Math.floor(Math.random() * (400 - 100 + 1)) + 100;

			// Give the user a server role, if it exists
			if (level_roles[level]) {
				let role = message.guild.roles.cache.find(
					(r) => r.name == level_roles[level]
				);

				if (role) message.member.roles.add(role);
			}

			// Send Message regarding the level up
			message.reply({
				content: `Congrats!\nYou have leveled up to level ${level}!\nYou now need ${xp_to_next_level} XP to level up again.`,
			});
		}

		// Update the user's level in the database
		database.User.updateUser(
			user.user_id,
			user.server_id,
			user.permission,
			{
				level: level,
				xp: xp,
				lastXPUpdate: new Date(),
				xp_to_next_level: xp_to_next_level,
			}
		);
	}

	// Automatic Bot Replies
	if (process.env.NODE_ENV === "production") {
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
	}

	// Commands
	if (!message.content.startsWith(process.env.PREFIX)) return;
	const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);

	if (!command) return;

	if (user.dataValues.permission <= command.data.permission)
		return message.reply({
			content: `You do not have enough permissions to use this command.\nCommand Permissions: ${commandPermissions}\nYour Permissions: ${userPermissions}`,
		});

	try {
		const context = {
			message: message,
			arguments: args,
		};

		await command.execute(context, client, database);
	} catch (error) {
		logger.error(`Command (${commandName})`, error);

		message.reply(
			`I just became a failure, hold up.\n\n${codeBlock("js", error)}`
		);
	}
});

// Discord Interaction Handler (Select Menu)
client.on("interactionCreate", async (interaction) => {
	if (!interaction.isSelectMenu()) return;

	if (interaction.customId === "failure_roles_add") {
		let rolesGiven = "";
		let rolesRemoved = "";

		interaction.values.forEach(async (value) => {
			const role = interaction.guild.roles.cache.find(
				(r) => r.name == value.replaceAll("_", " ")
			);

			if (role) {
				if (
					interaction.member.roles.cache.some(
						(role) => role.name === value.replaceAll("_", " ")
					)
				) {
					interaction.member.roles.remove(role);

					return (rolesRemoved =
						rolesRemoved + `\t - ${value.replaceAll("_", " ")}\n`);
				}

				interaction.member.roles.add(role);

				rolesGiven =
					rolesGiven + `\t - ${value.replaceAll("_", " ")}\n`;
			}
		});

		if (rolesGiven === "") rolesGiven = "\t None";
		if (rolesRemoved === "") rolesRemoved = "\t None";

		interaction.reply({
			content: `You have been given the following roles:\n${rolesGiven}\nThe following roles have been removed:\n${rolesRemoved}`,
			ephemeral: true,
		});
	}
});

// Discord Server Member Join Event
client.on("guildMemberAdd", (member) => {
	if (!process.env.NODE_ENV === "production") return;

	const channel = member.guild.channels.cache.find(
		(channel) => channel.name === "welcome"
	);
	if (!channel) return;

	client.channels.cache.get(channel.id).send(memes["failure_management"]);
	client.channels.cache.get(channel.id).send(`<@${member.id}>`);

	// Assign failure role (if exists)
	let role = member.guild.roles.cache.find((r) => r.name == "failures");
	if (!role) return;
	member.roles.add(role);
});

// Discord Server Member Leave Event
client.on("guildMemberRemove", (member) => {
	if (!process.env.NODE_ENV === "production") return;

	const channel = member.guild.channels.cache.find(
		(channel) => channel.name === "welcome"
	);
	if (!channel) return;

	client.channels.cache
		.get(channel.id)
		.send(
			`${member.user.username}#${member.user.discriminator} has left the server!`
		);
});

// Login to Discord
client.login(process.env.TOKEN);
