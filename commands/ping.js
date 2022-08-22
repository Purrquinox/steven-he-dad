module.exports = {
	data: {
		name: "ping",
		description: "Check my Ping!",
		permission: 0,
		category: "misc",
		arguments: null,
	},
	async execute(context, client, database) {
		const message = await context.message.reply({
			content: "Pinging our servers!",
			fetchReply: true,
		});

		const discord = Math.round(client.ws.ping);
		const msgLatency = Math.round(
			message.createdTimestamp - context.message.createdTimestamp
		);

		message.edit({
			content: `Discord Websocket Heartbeat: ${discord}ms.\nDiscord Message Roundtrip Latency: ${msgLatency}ms.`,
		});
	},
};
