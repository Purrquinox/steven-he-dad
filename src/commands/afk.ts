export default {
	data: {
		name: "afk",
		description: "Set your AFK status",
		category: "failure",
		arguments: ["status"],
	},
	async execute(context, client, EmbedBuilder, database) {
		const status = context.arguments[0] || null;

		if (status) {
			if (status === "true") {
				await database.User.setAFK(
					context.message.author.id,
					context.message.guild.id,
					true
				);

				return context.message.reply(
					"Success!\nYour AFK Status has been set to `true`"
				);
			}

			if (status === "false") {
				await database.User.setAFK(
					context.message.author.id,
					context.message.guild.id,
					false
				);

				return context.message.reply(
					"Success!\nYour AFK Status has been set to `false`"
				);
			} else
				return context.message.reply(
					"Error: Invalid Option. You must specify `true` or `false` for your AFK status."
				);
		} else
			return context.message.reply(
				"Error: Invalid Option. You did not specify anything for `status` which can be `true` or `false`."
			);
	},
};
