"use strict";
const logger = require("./logger.js");
const config = require("./config.json");
// TODO: sûrement qu'il faut inclure le Client ou le ClientCommando

// Class variables
// var _endLevel;

class LogSender {
   constructor() {
      // this.client;
   }

   async sendErrorLogs() {
      await this.sendFile("**The Node error log:**", `./logs/${config.logErrorName}`);
   }

   async sendInfoLogs() {
      await this.sendFile("**The Node info log:**", `./logs/${config.logName}`);
   }

   async sendPlayerDB(){
      await this.sendFile("**The PlayersDB**", `./playersDB.json`);
   }

   async sendFile(msg, filePath){
      if (this.client === undefined) {
         logger.error(`The client variable was not initialized in LogSender.js. You need to do something like this: logSender.useThisClient(client);`);
         throw new Error(`The client variable is not configured in LogSender.js.`);
      }

      var channel = this.client.channels.get(config.backupChannel);
      if (channel===undefined) {
         logger.error(`Error in LogSenders.sendFile(). It looks like there was en error in the backupChannel property in the config.json file.`);
         throw new Error(`Incorrect backupChannel id in config.json.`);
      }

      var attach = {
         files: [{
            attachment: filePath
         }]
      };

      try {
         await channel.send(msg, attach);
      } catch (err) {
         logger.error(`There was an error while trying to send logs (${msg}) with file "${filePath}".`);
         logger.error(err);
         throw err;
      }

   }

   setupAutoBackups() {
      // This setups the daily auto backups. These backups are sent to the admin every <12> hours.
      logger.info(`Setting up the automated backup to every ${config.intervalLogBackup} hours.`);
      setInterval(this.sendAutoBackup,
         // config.intervalLogBackup*60*60*1000 // hours to milliseconds
         5*1000 // 5 seconds, for debugging purpose
      );
   }

   async sendAutoBackup(){
      logger.info(`It's time for the automated backup every ${config.intervalLogBackup} hours.`);
      logger.info(`1Here's the client: ${this.client}`);
      try{
         await this.sendPlayerDB();

      } catch(err){
         logger.error(`Could not send the auto backups.`);
         logger.info(`2Here's the client: ${this.client}`);
         this.client.users.get(config.ownerAdmin.discordID).send(`Yo! I'm in trouble. I can't send the backup of the DB. You might want to look into this! Here's the error: \`\`\`${err.stack}\`\`\``);
         // TODO: Je pense que ça crash ici parce que c'est une question de variable statique? Genre que la variable client est perdue quelque part parce qu'elle n'est pas statique?
      }
   }

   useThisClient(cl) {
      this.client = cl;
      logger.info(`3Here's the client: ${this.client}`);
   }
}
const ls = new LogSender();
ls.setupAutoBackups();
module.exports = ls;
