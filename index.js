// Packages
const {
   Client,
   GatewayIntentBits,
   ActivityType
} = require('discord.js'); 
const client = new Client({
    intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMembers, 
	GatewayIntentBits.GuildMessages, 
	GatewayIntentBits.MessageContent
    ]
});
const database = require("./database.js");
const words = require("./words.json");
require("dotenv").config();

// Ready
client.once('ready', () => {
    // Set Activity
    client.user.setActivity(`all failures`, {
        type: ActivityType.Watching
    });

    client.user.setStatus("dnd");

    console.log("Connected to Discord");
});

// Message
client.on("messageCreate", (message) => {
    // Block Bots
    if (message.author.bot) return;

    // Automatic Bot Replies
    const content = message.content.toLowerCase();
    let matchFound = false;

    content.split(" ").forEach((word) => {
       if (matchFound) return;

       const match = words[word];

       if (!match) return;
       else {
          message.reply(match);
          matchFound = true;
       }
    });
});

// Member Join
client.on("guildMemberAdd", (member) => {
   client.channels.cache.get("1005175177161752636").send(`https://tenor.com/view/steven-he-welcome-to-the-failure-gif-24563965`);
   client.channels.cache.get("1005175177161752636").send(`<@${member.id}>`);

   // Assign failure role (if exists)
   let role = member.guild.roles.cache.find(r => r.name == 'failures');
   if (!role) return;
   member.roles.add(role);
});

// Login to Discord
client.login(process.env.TOKEN);
