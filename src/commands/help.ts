export default {
	data: {
		name: "help",
		description: "Need some help?",
		category: "misc",
		arguments: ["category"],
	},
	async execute(context, client, commands, EmbedBuilder, database) {
		let p = "";

		const category = context.arguments[0] || null;

		commands.forEach((command) => {
			if (command.data.name === "help") return;

			if (category && command.data.category !== category) return;

			const name = command.data.name;
			const description = command.data.description;

			if (command.data.arguments) {
				let args: string = command.data.arguments
					.map((arg) => {
						return `<${arg}>`;
					})
					.join(", ");

				p += `Name: ${name}\nDescription: ${description}\nCategory: ${command.data.category}\n\t:information_source: Command Arguments: ${args}\n\n`;
			} else
				p += `Name: ${name}\nDescription: ${description}\nCategory: ${command.data.category}\n\t:information_source: Command Arguments: None\n\n`;
		});

		if (p === "")
			p =
				"It seems we don't have any command matching the filter you provided.";

		const embed = new EmbedBuilder()
			.setTitle("Failure Help")
			.setURL("https://failuremgmt.tk/")
			.setDescription(
				`Don't know how to manage your failures? You are at the right place.\n\n${p}`
			)
			.setColor(0xff0000);

		context.message.reply({
			embeds: [embed],
		});
	},
};
