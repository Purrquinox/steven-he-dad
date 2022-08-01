const {
   Client,
   GatewayIntentBits,
   ActivityType
} = require('discord.js'); 
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
require("dotenv").config();

// Ready
client.once('ready', () => {
    // Set Activity
    client.user.setActivity(`all failures`, {
        type: ActivityType.Watching
    });

    client.user.setStatus("dnd");

    client.channels.cache.get("896956024081248257").send("all of you are failures");

    console.log("Connected to Discord");
});

// Message
client.on("messageCreate", (message) => {
    // Block Bots
    if (message.author.bot) return;

    // Automatic Bot Replies (Random Message)
    if (message.content.toLowerCase().includes("drugs")) {
        message.reply("Don't do drugs, too expensive");
    }

    if (message.content.toLowerCase().includes("siri")) {
        message.reply("My name is Alexa!");
    }
});

// Login to Discord
client.login(process.env.TOKEN);
