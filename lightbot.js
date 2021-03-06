"use strict";

var logger = require('./logger.js');
const config = require("./config.json");
const Commando = require('discord.js-commando');
const auth = require('./auth.json');
const path = require('path');
const sqlite = require('sqlite');
const oneLine = require('common-tags').oneLine;
const logSender = require("./LogSender.js");


const client = new Commando.Client({
    owner: config.ownerAdmin.discordID
});


// Set the SettingProvider using sqlite
client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);


client.registry
   // Registers your custom command groups
   // Register GROUPS
   .registerDefaultGroups()
   .registerGroups([
      ['learning', "Learning (Example commands to learn from which won't be in the final bot)"],
      ['light', 'Light'],
      ["light-admin", "light-admin (commands for the admin to use)"]
   ])

   // Register TYPES
   .registerDefaultTypes()
	// .registerTypesIn(path.join(__dirname, 'types')) //Uncomment this line if we have custom types in the future.

   // Register COMMANDS
   .registerCommandsIn(path.join(__dirname, 'commands'))
   .registerDefaultCommands({
      help: false,
      eval_: false,
      commandState: false
   });


client.login(auth.token);
logSender.useThisClient(client);


// client
client.on('error', logger.error)
client.on('warn', logger.warn)
client.on('debug', logger.debug)
client.on('ready', () => {
    logger.info(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
    client.user.setActivity("Type !light or !help");
})
client.on('disconnect', () => { logger.warn('Disconnected!'); })
client.on('reconnecting', () => { logger.warn('Reconnecting...'); })
client.on('commandError', (cmd, err) => {
		if(err instanceof Commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
})
client.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
})
client.on('commandPrefixChange', (guild, prefix) => {
		logger.info(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
})
client.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
})
client.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
});
