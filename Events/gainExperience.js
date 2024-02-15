const Discord = require("discord.js");

module.exports ={
    event: "messageCreate",

    async run (bot, message) {
        if(message.author.bot || message.channel.type === Discord.ChannelType.DM)
            return;
        
        const db = bot.db;
        const guildID = message.guild.id;
        const userID = message.author.id;

        message.guild.name = bot.function.securiser(message.guild.name);
        message.author.globalName = bot.function.securiser(message.author.globalName);

        db.query(`SELECT * FROM xp WHERE guildID = ${guildID} AND userID = ${userID}`, (err, xp) => {
            if(xp.length >= 1){
                let xptogive = Math.floor(Math.random() * 25);
                
                db.query(`UPDATE xp SET xp = ${xp[0].xp + xptogive} WHERE guildID = ${guildID} AND userID = ${userID}`);
            
                if(xp[0].xp >= (xp[0].level + 1) * 1000){
                    db.query(`UPDATE xp SET xp = ${xp[0].xp - (xp[0].level + 1) * 1000} WHERE guildID = ${guildID} AND userID = ${userID}`);
                    db.query(`UPDATE xp SET level = ${xp[0].level + 1} WHERE guildID = ${guildID} AND userID = ${userID}`);
                    
                    return bot.function.mp(bot, message.user, `Tu es passé au niveau ${xp[0].level + 1} sur le serveur ${message.guild.name}. Félicitation 🥳🥳🥳!!!!!`);
                }
            }
            else
                db.query(`INSERT INTO xp (ID, guildID, guildName, userID, userName, xp, level)
                    VALUES ('${bot.function.createID("XP", 10)}', ${guildID}, '${message.guild.name}', ${userID}, '${message.author.userName}', 0, 0)`);
        });
    },
}