const Discord = require("discord.js");

module.exports = {
    name: "endpick",
    description: "Stoppe le pick en cours",
    longdescription: "Stoppe le pick en cours, supprime les messages crées par le pick et enlève le role donné aux séléctionné",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "UHC",

    async run(bot, message, args, db) {
        try{
            db.query(`SELECT * FROM pick WHERE guildID = ${message.guild.id}`, function (err, pick) {
                const role = message.guild.roles.cache.get(pick[0].roleCanPickID);
                const roleToRemove = message.guild.roles.cache.get(pick[0].rolePicksID);
                let selectionnes = [];

                if(!role)
                    return bot.eph(bot, message, "Aucun role n'a été défini comme étant le role minimum pour pouvoir gérer les picks !");
                if(message.guild.members.cache.get(message.user.id).roles.highest.comparePositionTo(role) < 0)
                    return bot.eph(bot, message, "Vous n'avez pas la permission d'utiliser cette commande !");
                if(pick[0].pickChannelID !== message.channel.id)
                    return bot.eph(bot, message, "Vous n'êtes pas dans le salon autorisé pour les picks !");
                if(!pick[0].partieID)
                    return bot.eph(bot, message, "Il n'y a pas de partie en cours");

                if(roleToRemove){
                    selectionnes = message.guild.roles.cache.get(roleToRemove.id).members.map(m=>m.user);
                    selectionnes.forEach(user => message.guild.members.cache.get(user.id).roles.remove(roleToRemove));
                }

                message.channel.bulkDelete(parseInt(pick[0].nombreMessages));

                db.query(`UPDATE pick SET
                    partieID = "",
                    partieName = "",
                    nombreMessages = 0 WHERE guildID = ${message.guild.id}`);

                db.query(`DROP TABLE partie_${pick[0].partieID}`);

                console.log(`La partie ${pick[0].partyName} a bien été fermé`);
                return bot.eph(bot, message, `La partie ${pick[0].partyName} a bien été fermé !`);
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}