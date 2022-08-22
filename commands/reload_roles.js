const { ActionRowBuilder, SelectMenuBuilder } = require("discord.js");

module.exports = {
	data: {
		name: "reload_roles",
		description: "Edit the Failure Roles message to match new content.",
		permission: 1,
		category: "roles",
		arguments: null,
	},
	async execute(context, client, database) {
		const roles = reaction_roles.map((role) => {
			return {
				label: `${role.name}`,
				description: role.description,
				value: role.name.replaceAll(" ", "_"),
			};
		});

		const row = new ActionRowBuilder().addComponents(
			new SelectMenuBuilder()
				.setCustomId("failure_roles_add")
				.setPlaceholder("Choose some nice failure roles!")
				.setMinValues(1)
				.setMaxValues(roles.length)
				.addOptions(roles)
		);

		const channel = client.channels.cache.get("1010022177178923138");

		channel.send({
			content: "Use the Select Menu to choose some nice failure roles.",
			components: [row],
		});

		return context.message.reply({
			content: "Failure Roles reloaded.",
		});
	},
};
