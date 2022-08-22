module.exports = {
	data: {
		name: "leaderboard",
		description: "View the server leaderboard.",
		permission: 0,
		arguments: null,
	},
	async execute(context, client, database) {
		let leaderboard = "";
		let usersShown = 0;

		const users = await database.User.getAllUsersByServer(
			context.message.guild.id
		);
		const sortedUsers = users.sort(
			(a, b) => b.dataValues.levels.level - a.dataValues.levels.level
		);

		sortedUsers.forEach(async (user, index) => {
			if (usersShown === 5) return;

			const userInfo = await client.users.fetch(user.dataValues.user_id);

			leaderboard =
				leaderboard +
				`${index + 1}. ${userInfo.username}#${
					userInfo.discriminator
				}\n\tLevel: ${user.dataValues.levels.level}\n\tXP: ${
					user.dataValues.levels.xp
				}\n\n`;
			usersShown = usersShown + 1;
		});

		context.message.channel.sendTyping();

		setTimeout(() => {
			context.message.reply(leaderboard);
		}, 2000);
	},
};
