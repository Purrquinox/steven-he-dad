const { EmbedBuilder } = require("discord.js");
const { permissions } = require("../data.json");

module.exports = {
	data: {
		name: "help",
		description: "Need some help?",
		permission: 0,
		arguments: null,
	},
	async execute(context, client, database) {
		let commands = "";

		client.commands.forEach((command) => {
			if (command.data.name === "help") return;

			const name = command.data.name;
			const description = command.data.description;

			let permission = `${permissions[command.data.permission].replaceAll(
				"_",
				" "
			)}+`;
			let arguments;

			if (command.data.arguments) {
				arguments = command.data.arguments
					.map((arg) => {
						return `<${arg}>`;
					})
					.join(", ");

				commands += `Name: ${name}\nDescription: ${description}\n\t:lock: Command Permissions: ${permission}\n\t:information_source: Command Arguments: ${arguments}\n\n`;
			} else
				commands += `Name: ${name}\nDescription: ${description}\n\t:lock: Command Permissions: ${permission}\n\t:information_source: Command Arguments: None\n\n`;
		});

		const embed = new EmbedBuilder()
			.setTitle("Failure Help")
			.setURL("https://failuremgmt.tk/")
			.setDescription(
				`Don't know how to manage your failures? You are at the right place.\n\n${commands}`
			)
			.setColor(0xff0000);

		context.message.reply({
			embeds: [embed],
		});
	},
};
