#echo "I'm launching lightbot in background mode. You can then close this terminal and it'll keep running in the background. 
#To turn it off, you need to use 
#pgrep node
#to know then PID, then 
#kill -2 PID
#to shut it down."

#nohup node lightbot.js &
#sleep 5

pm2 start lightbot.js