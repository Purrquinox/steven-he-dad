module.exports = {
	data: {
		name: "leaderboard",
		description: "View the server leaderboard.",
		category: "levels",
		arguments: null,
	},
	async execute(context, client, EmbedBuilder, database) {
		let leaderboard = "";

		const users = await database.User.getAllUsersByServer(
			context.message.guild.id
		);

		const sortedUsers = users
			.sort(
				(a, b) => b.dataValues.levels.level - a.dataValues.levels.level
			)
			.sort((a, b) => (b.dataValues.levels.xp = a.dataValues.levels.xp));

		let shown = 0;

		sortedUsers.forEach(async (user, index) => {
			const userInfo = await client.users.fetch(user.dataValues.user_id);

			if (shown === 5) return;

			leaderboard =
				leaderboard +
				`${index + 1}. **${userInfo.username}#${
					userInfo.discriminator
				}**\n\t- Level: ${user.dataValues.levels.level}\n\t- XP: ${
					user.dataValues.levels.xp
				}/${user.dataValues.levels.xp_to_next_level}\n\n`;

			shown = shown + 1;
		});

		context.message.channel.sendTyping();

		setTimeout(() => {
			const embed = new EmbedBuilder()
				.setTitle(`Leaderboard for ${context.message.guild.name}`)
				.setColor(0xff0000)
				.setDescription(leaderboard)
				.setFooter({
					text: `This command was executed by ${context.message.author.username}#${context.message.author.discriminator}.`,
					icon_url: context.message.member.displayAvatarURL(),
				});

			context.message.reply({
				embeds: [embed],
			});
		}, 2000);
	},
};
