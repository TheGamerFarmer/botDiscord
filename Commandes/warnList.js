const Discord = require("discord.js");

module.exports = {
    name: "warnlist",
    description: "Afficher la liste des warns d'un utilisateur",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    
    options: [{
        type: "user",
        name: "membre",
        description: "L'utilisateur dont on veux afficher les warns",
        required: true,
    }],

    async run(bot, message, args, db) {
        try{
            let user = args.getUser("membre");
            
            await db.query(`SELECT * FROM warn WHERE guildID = ${message.guild.id} AND userID = ${user.id}`, (err, warn) => {                
                if(warn.length < 1)
                    return bot.msg(message, "Ce membre n'a pas de warn !");

                user.globalName = bot.function.securiser(user.globalName);
                message.user.globalName = bot.function.securiser(message.user.globalName);

                let Embed = new Discord.EmbedBuilder()
                    .setColor(bot.color)
                    .setTitle(`Warns de ${user.globalName}`)
                    .setThumbnail((message.guild.members.cache.get(user.id)).displayAvatarURL())
                    .setTimestamp()
                    .setFooter({text: "Warns"})
                    .setAuthor({name: `Auteur : ${message.user.globalName}` });

                for(let i = 0; i<warn.length; i++) {
                    Embed.addFields([{name: `Warn n°${i + 1}`,
                        value: `> **Auteur** : ${message.guild.members.cache.get(warn[i].authorID)}
                            > **ID** : ${warn[i].warnID}
                            > **Raison** : ${warn[i].raison}
                            > **Date** : <t:${Math.floor(warn[i].date / 1000)}>`}]);
                }

                return bot.msg(message, {embeds: [Embed]});
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}