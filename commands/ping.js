module.exports = {
	data: {
		name: "ping",
		description: "Check my Ping!",
		permission: 0,
		arguments: null,
	},
	async execute(context, client, database) {
		const ping = Math.round(client.ws.ping);

		context.message.reply(`WS Ping: ${ping}ms.`);
	},
};
