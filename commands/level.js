module.exports = {
	data: {
		name: "level",
		description: "Check your level/xp.",
		category: "levels",
		arguments: ["failure"],
	},
	async execute(context, client, EmbedBuilder, database) {
		let user;
		const mention = context.message.mentions.users.first();

		if (mention)
			user = {
				data: await database.User.getUser(
					mention.id,
					context.message.guild.id
				),
				discord: mention,
			};
		else
			user = {
				data: await database.User.getUser(
					context.message.author.id,
					context.message.guild.id
				),
				discord: context.message.author,
			};

		if (!user.data)
			return context.message.reply(
				`${user.discord.username}#${user.discord.discriminator} was not found.`
			);
		else
			return context.message.reply({
				content: `User: ${user.discord.username}#${
					user.discord.discriminator
				}\n\tLevel: ${String(user.data.levels.level)}\n\tXP: ${String(
					user.data.levels.xp
				)}/${String(user.data.levels.xp_to_next_level)}`,
			});
	},
};
