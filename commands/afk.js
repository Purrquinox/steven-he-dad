module.exports = {
	data: {
		name: "afk",
		description: "Set your AFK status",
		permission: 0,
		category: "failure",
		arguments: ["status"],
	},
	async execute(context, client, database) {
		const status = context.arguments[0] || null;

		if (status) {
			if (status === "true") {
				await database.User.setAFK(
					context.message.author.id,
					context.message.guild.id,
					true
				);

				return message.reply(
					"Success!\nYour AFK Status has been set to `true`"
				);
			}

			if (status === "false") {
				await database.User.setAFK(
					context.message.author.id,
					context.message.guild.id,
					false
				);

				return message.reply(
					"Success!\nYour AFK Status has been set to `false`"
				);
			} else
				return message.reply(
					"Error: Invalid Option. You must specify `true` or `false` for your AFK status."
				);
		} else
			return message.reply(
				"Error: Invalid Option. You did not specify anything for `status` which can be `true` or `false`."
			);
	},
};
