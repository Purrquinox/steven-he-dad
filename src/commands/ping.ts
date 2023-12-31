export default {
	data: {
		name: "ping",
		description: "Check my Ping!",
		category: "misc",
		arguments: null,
	},
	async execute(context, client, EmbedBuilder, database) {
		const message = await context.message.reply({
			content: "Pinging our servers!",
			fetchReply: true,
		});

		const discord = Math.round(client.ws.ping);
		const msgLatency = Math.round(
			message.createdTimestamp - context.message.createdTimestamp
		);

		const embed = new EmbedBuilder()
			.setTitle("Pong!")
			.setColor(0xff0000)
			.setFields(
				{
					name: "Discord Websocket Hearbeat:",
					value: `${discord}ms`,
					inline: true,
				},
				{
					name: "Discord Message Roundtrip Latency:",
					value: `${msgLatency}ms`,
					inline: true,
				}
			);

		message.edit({
			embeds: [embed],
		});
	},
};
