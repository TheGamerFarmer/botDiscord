const Discord = require("discord.js");

module.exports = {
    name: "blacklistlist",
    description: "Affiche la liste des gens blacklist",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "UHC",

    async run(bot, message) {
        try{
            bot.db.query(`SELECT * FROM blacklist WHERE guildID = ${message.guild.id}`, function (err, blacklist) {
                let embedList = [
                    new Discord.EmbedBuilder()
                        .setColor(bot.color)
                        .setTitle(`Affichage de la blacklist`)
                        .setThumbnail(message.guild.iconURL())
                        .setDescription(`Nombre de joueurs blacklist: ${blacklist.length}`)
                ];

                for(let i = 25; blacklist.length > i; i += 25) {
                    embedList.push(new Discord.EmbedBuilder()
                        .setColor(bot.color)
                        .setThumbnail(message.guild.iconURL()));
                }

                blacklist.forEach(function (joueur, nombreBlacklist) {                    
                    let utilisateur = message.guild.members.cache.get(joueur.userID);

                    embedList[Math.floor(nombreBlacklist / 25)].addFields({
                        name: `**${utilisateur ? utilisateur.user.globalName : joueur.pseudoMc}**`,
                        value: `Compte discord: ${utilisateur || "pas défini"}\npseudo mc: ${joueur.pseudoMc || "pas défini"}\nRaison: ${joueur.raison}`
                    });
                });
                
                embedList[embedList.length - 1].setTimestamp()
                    .setFooter({text: "Affichage de la blacklist"});

                return embedList.forEach((embed, temps) => setTimeout(() => bot.msg(message, {embeds: [embed]}), 500 * temps));
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}