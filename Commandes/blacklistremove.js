const Discord = require("discord.js");

module.exports = {
    name: "blacklistremove",
    description: "Retire quelqu'un de la blacklist",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "UHC",
    
    options: [{
            type: "string",
            name: "raison",
            description: "La raison du retrait de la blacklist",
            required: true,
            autocomplete: false,
            setMinLength: 1,
            setMaxLength: 999,
        }, {
            type: "user",
            name: "membre",
            description: "Le membre à retirer de la blacklist",
            required: false,
        }, {
            type: "string",
            name: "pseudomc",
            description: "Le pseudo mc du joueur à retirer de la blacklist",
            required: false,
            autocomplete: false,
            setMinLength: 1,
            setMaxLength: 16,
        }
    ],

    async run(bot, message, args, db) {
        try{
            db.query(`SELECT * FROM pick WHERE guildID = ${message.guild.id}`, function (err, pick){
                let user = args.getUser("membre");
                let raison = args.getString("raison");
                let pseudomc = args.getString("pseudomc");
                const role = message.guild.roles.cache.get(pick[0].roleCanPickID);

                if(!role)
                    return bot.eph(bot, message, "Aucun role n'a été défini comme étant le role minimum pour pouvoir gérer les picks !");
                if(message.member.roles.highest.comparePositionTo(role) < 0)
                    return bot.eph(bot, message, "Vous n'avez pas la permission d'utiliser cette commande !");
                if(!user && !pseudomc)
                    return bot.eph(bot, message, "Tu dois renseigner soit le pseudo mc soit le compte discord !")
                if(user && message.user.id === user.id)
                    return bot.eph(bot, message, "Tu ne peux pas t'enlever de la blacklist tout seul !");

                raison = bot.function.securiser(raison);
                if(pseudomc)
                    pseudomc = bot.function.securiser(pseudomc);
                if(user)
                    user.globalName = bot.function.securiser(user.globalName);
                message.guild.name = bot.function.securiser(message.guild.name);

                db.query(`SELECT * FROM blacklist WHERE guildID = ${message.guild.id} AND (userID = ${user ? user.id : 0} OR pseudoMc = '${pseudomc}')`, function (err, blacklist) {
                    if(blacklist.length < 1)
                        return bot.eph(bot, message, "Cet utilisateur n'est pas blacklist !");

                    db.query(`DELETE FROM blacklist WHERE guildID = ${message.guild.id} AND (userID = ${user ? user.id : 0} OR pseudoMc = '${pseudomc}')`);
                    
                    bot.function.mp(bot, user, `Tu n'es plus blacklist du serveur ${message.guild.name} pour la raison: ${raison}`);
                    console.log(`Le joueur ${user?.globalName || ""}${pseudomc ?
                        ` dont le pseudo mc est ${pseudomc}` : ""} qui avait été blacklist du serveur ${message.guild.name} pour la raison: ${blacklist[0].raison} a bien été retiré de la blacklist pour la raison: ${raison} !`);
                    return bot.msg(message, `Le joueur ${user || ""}${pseudomc ?
                        ` dont le pseudo mc est ${pseudomc}` : ""} qui avait été blacklist pour la raison: ${blacklist[0].raison} a bien été retiré de la blacklist pour la raison: ${raison} !`);
                });
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}