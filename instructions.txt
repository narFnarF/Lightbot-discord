# Setup Lightbot to auto-launch using pm2
Requirement: pm2 must be installed already.

Start Lightbot:
`pm2 start lightbot.js`

Save the config:
`pm2 save`

Setup pm2 to auto-launch when rebooting your device:
`pm2 startup` 
(it will ask to copy/paste a command to finalize its install)



# Basic instructions
Restart the bot in case of failure or after an update:
`pm2 restart lightbot`

List all processes monitored by pm2
`pm2 ls`

Monitor live
`pm2 monit`

Stop Lightbot
`pm2 stop lightbot`



# How to update PM2 after a Node update

Source: https://pm2.io/doc/en/runtime/guide/startup-hook/

We need to reset the auto-start script after each big node update. Run these 2 commands:
`pm2 unstartup`
`pm2 startup`
(it will ask to copy/paste a command to finalize its install)


# If the bot has moved to a different folder
If the bot has moved to a different folder, we need to do this:

Remove the old one:
`pm2 del lightbot`

Restart the new one:
`pm2 start lightbot.js`

Save the auto-start config:
`pm2 save`
