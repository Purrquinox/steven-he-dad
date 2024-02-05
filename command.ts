interface Command {
	data: {
		name: string;
		description: string;
		category: string;
		arguments: string[];
	};
	execute: (
		context,
		client,
		commands,
		EmbedBuilder,
		database
	) => Promise<void>;
}

// Commands
if (!message.content.startsWith(process.env.PREFIX || ".")) return;
const args = message.content
    .slice((process.env.PREFIX || ".").length)
    .split(/ +/);
const commandName = args.shift()?.toLowerCase();
const command = commands.get(commandName);

if (!command) return;

try {
    const context = {
        message: message,
        arguments: args,
    };

    await command.execute(
        context,
        client,
        commands,
        EmbedBuilder,
        database
    );
} catch (error) {
    logger.error(`Command (${commandName})`, error);

    message.reply(
        `I just became a failure, hold up.\n\n${codeBlock("js", error)}`
    );
}