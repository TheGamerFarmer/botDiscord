const Discord = require("discord.js");
const canvas = require("discord-canvas-easy");

module.exports = {
    name: "classement",
    description: "Obtenir le classement du serveur ou d'un utilisateur",
    longdescription: "Obtenir le classement d'un utilisateur si l'utilisateur est donné dans l'option, ou du serveur entier dans le cas contraire",
    permission: "Aucune",
    dm: false,
    category: "Experience",
    
    options: [{
        type: "user",
        name: "membre",
        description: "L'utilisateur dont on veut voir le classement",
        required: false,
    }],

    async run(bot, message, args, db) {
        try{
            let user = args.getUser("membre");

            if(user){
                if(!message.guild.members.cache.get(user.id))
                    return bot.eph(bot, message, "Cet utilisateur n'est pas sur le serveur");
                
                db.query(`SELECT * FROM xp WHERE guildID = ${message.guild.id} AND userID = ${user.id}`, function (err, xp) {
                    db.query(`SELECT * FROM xp WHERE guildID = ${message.guild.id} ORDER BY level DESC, xp DESC`, function (error, classement) {
                        if(xp.length < 1)
                            return bot.msg(message, "Cet utilisateur n'a jamais écrit sur ce serveur");
                
                        message.deferReply();

                        const rank = classement.findIndex(r => r.userID === user.id) + 1;
    
                        return new canvas.Card()
                            .setBackground(classement[0].URLClassementPerso)
                            .setBot(bot)
                            .setColorFont("#ffffff")
                            .setRank(rank)
                            .setUser(user)
                            .setColorProgressBar(bot.color)
                            .setGuild(message.guild)
                            .setXp(xp[0].xp)
                            .setLevel(xp[0].level)
                            .setXpNeed((xp[0].level + 1) * 1000)
                            .toCard()
                            .then(card => message.followUp({files: [new Discord.AttachmentBuilder(card.toBuffer(), {name: "rank.png"})]}));
                    });
                });
            }
            else{
                db.query(`SELECT * FROM xp WHERE guildID = ${message.guild.id} ORDER BY level DESC, xp DESC`, function (err, xp) {
                    message.deferReply();

                    const leaderboard = new canvas.Leaderboard()
                        .setBackground(xp[0].URLClassement)
                        .setBot(bot)
                        .setGuild(message.guild)
                        .setColorFont("#ffffff");

                    for (let i = 0 ; i < Math.min(xp.length, 10) ; i++)
                        leaderboard.addUser(message.guild.members.cache.get(xp[i].userID).user, xp[i].level, xp[i].xp, (xp[i].level + 1) * 1000);
                    
                    return leaderboard.toLeaderboard()
                        .then(classement => message.followUp({ files: [new Discord.AttachmentBuilder(classement.toBuffer(), {name: "classement.png"})]}));
                });
            }
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}