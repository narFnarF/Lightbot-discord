# Setup Lightbot to auto-launch using pm2
Requirement: pm2 must be installed already.

Start Lightbot:
`pm2 start lightbot.js`
(Note: You need to run this in Lightbot's folder.)

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

Monitor what's happening live:
`pm2 monit`

Stop Lightbot:
`pm2 stop lightbot`



# How to update PM2 after a Node update (if it's broken)

Source: https://pm2.io/doc/en/runtime/guide/startup-hook/

We need to reset the auto-start script after each big node update. Run these 2 commands:
`pm2 unstartup`
(it will ask to copy/paste a command to finalize its uninstall)

`pm2 startup`
(it will ask to copy/paste a command to finalize its install)

Restart Lightbot:
`pm2 start lightbot.js`
(Note: You need to run this in the Lightbot folder)

Save the auto-start config:
`pm2 save`


# If the bot has moved to a different folder
If the bot has moved to a different folder, we need to do this:

Remove the old one:
`pm2 del lightbot`

Restart the new one:
`pm2 start lightbot.js`
(Note: You need to run this in Lightbot's folder.)

Save the auto-start config:
`pm2 save`
