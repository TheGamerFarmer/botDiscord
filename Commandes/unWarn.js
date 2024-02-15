const Discord = require("discord.js");

module.exports = {
    name: "unwarn",
    description: "Enlever le warn d'un utilisateur",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    
    options: [{
        type: "user",
        name: "membre",
        description: "L'utilisateur à warn",
        required: true,
    }, {
        type: "string",
        name: "warnid",
        description: "L'ID du warn à retirer",
        required: true,
        autocomplete: true,
        setMinLength: 15,
        setMaxLength: 15,
    }, {
        type: "string",
        name: "raison",
        description: "La raison du retrait de l'avertissement",
        required: true,
        autocomplete: false,
        setMinLength: 1,
        setMaxLength: 999,
    }],

    async run(bot, message, args, db) {
        try{
            let user = args.getUser("membre");
            let raison = args.getString("raison");
            let warnID = args.getString("warnid");

            if(message.user.id === user.id)
                return bot.eph(bot, message, "Tu ne peux pas t'enlever un warn toi même !");
            if(message.member.roles.highest.comparePositionTo(message.guild.members.cache.get(user.id).roles.highest) <= 0)
                return bot.eph(bot, message, "Tu ne peux enlever le warn de quelqu'un qui a un grade équivalent ou supérieur au tient !");

            raison = bot.function.securiser(raison);
            warnID = bot.function.securiser(warnID);
            message.user.globalName = bot.function.securiser(message.user.globalName);
            user.globalName = bot.function.securiser(user.globalName);
            message.guild.name = bot.function.securiser(message.guild.name);
        
            db.query(`SELECT * FROM warn WHERE warnID = '${warnID}'`, async (err, warn) => {
                await db.query(`DELETE FROM warn WHERE warnID = '${warnID}'`);

                console.log(`Le warn ${warnID} de l'utilisateur ${user.globalName} crée pour la raison : ${warn[0].raison} sur le serveur ${message.guild.name} a bien été retiré par ${message.user.globalName} pour cause de : ${raison}`);
                bot.function.mp(bot, user, `Ton warn ${warnID} crée pour la raison : ${warn[0].raison} a bien été retiré par ${message.user.globalName} pour cause de : ${raison}`);
                return bot.msg(message, `Le warn ${warnID} de l'utilisateur ${user} crée pour la raison : ${warn[0].raison} a bien été retiré par ${message.user} pour cause de : ${raison}`);
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}