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

   async sendErrorLogs(client) {
      return await this.sendFile("**The Node error log:**", `./logs/${config.logErrorName}`, client);
   }

   async sendInfoLogs(client) {
      return await this.sendFile("**The Node info log:**", `./logs/${config.logName}`, client);
   }

   async sendPlayerDB(client){
      return await this.sendFile("**The PlayersDB**", `./playersDB.json`, client);
   }

   async sendFile(msg, filePath, client){
      if (client === undefined) {
         logger.error(`The client variable was not initialized in LogSender.js. You need to do something like this: logSender.useThisClient(client);`);
         throw new Error(`The client variable is not configured in LogSender.js.`);
      }

      var channel = client.channels.get(config.backupChannel);
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
         var res;
         res = await channel.send(msg, attach);
         return res;
      } catch (err) {
         logger.error(`There was an error while trying to send logs (${msg}) with file "${filePath}".`);
         logger.error(err);
         throw err;
      }

   }

   setupAutoBackups() {
      // This setups the daily auto backups. These backups are sent to the admin every <12> hours.
      logger.info(`Setting up the automated backup to every ${config.intervalLogBackup} hours.`);
      setInterval( async ()=>{
         await this.sendAutoBackup()
      },
         config.intervalLogBackup*60*60*1000 // hours to milliseconds
         // 5*1000 // 5 seconds, for debugging purpose
      );
   }

   async sendAutoBackup(){
      logger.info(`It's time for the automated backup every ${config.intervalLogBackup} hours.`);
      try{
         await this.sendPlayerDB(this.client);

      } catch(err){
         logger.error(`Could not send the auto backups.`);
         const user = this.client.users.get(config.ownerAdmin.discordID);
         if (user !== undefined) {
            user.send(`Yo! I'm in trouble. I can't send the backup of the DB. You might want to look into this! Here's the error: \`\`\`${err.stack}\`\`\``);
         } else {
            logger.error(`Could not send the warning to the admin because the admin id is not setup properly in config.json.`)
         }
      }
   }

   useThisClient(cl) {
      this.client = cl;
   }
}
const ls = new LogSender();
ls.setupAutoBackups();
module.exports = ls;
