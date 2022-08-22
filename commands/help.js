const { EmbedBuilder } = require("discord.js");
const { permissions } = require("../data.json");

module.exports = {
	data: {
		name: "help",
		description: "Need some help?",
		permission: 0,
		category: "misc",
		arguments: ["category"],
	},
	async execute(context, client, database) {
		let commands = "";

		const category = context.arguments[0] || null;

		client.commands.forEach((command) => {
			if (command.data.name === "help") return;

			if (category && command.data.category !== category) return;

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

				commands += `Name: ${name}\nDescription: ${description}\nCategory: ${command.data.category}\n\t:lock: Command Permissions: ${permission}\n\t:information_source: Command Arguments: ${arguments}\n\n`;
			} else
				commands += `Name: ${name}\nDescription: ${description}\nCategory: ${command.data.category}\n\t:lock: Command Permissions: ${permission}\n\t:information_source: Command Arguments: None\n\n`;
		});

		if (commands === "")
			commands =
				"It seems we don't have any commands matching the filter you provided.";

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
