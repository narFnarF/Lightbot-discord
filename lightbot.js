"use strict";

var logger = require('./logger.js');
const config = require("./config.json");
const Commando = require('discord.js-commando');
const auth = require('./auth.json');
const path = require('path');
const sqlite = require('sqlite');
const oneLine = require('common-tags').oneLine;





const client = new Commando.Client({
    owner: config.ownerAdmin.discordID
});


// Set the SettingProvider using sqlite
client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);


client.registry
   // Registers your custom command groups
   .registerGroups([
      ['learning', "Learning (Example commands to learn from which won't be in the final bot)"]
   ])
   .registerGroup('light', 'Light')
   .registerGroup("light-admin", "light-admin (commands for the admin to use)")

   // Registers all built-in groups, commands, and argument types
   .registerDefaults()
	.registerTypesIn(path.join(__dirname, 'types'))
   .registerCommandsIn(path.join(__dirname, 'commands'));


client.login(auth.token);



// client
client.on('error', console.error)
client.on('warn', console.warn)
client.on('debug', console.log)
client.on('ready', () => {
		console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
      client.user.setActivity("Type !help");
})
client.on('disconnect', () => { console.warn('Disconnected!'); })
client.on('reconnecting', () => { console.warn('Reconnecting...'); })
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
		console.log(oneLine`
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
