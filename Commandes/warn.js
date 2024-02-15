const Discord = require("discord.js");

module.exports = {
    name: "warn",
    description: "Avertir un utilisateur",
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
        name: "raison",
        description: "La raison de l'avertissement",
        required: true,
        autocomplete: false,
        setMinLength: 1,
        setMaxLength: 999,
    }],

    async run(bot, message, args, db) {
        try{
            let user = args.getUser("membre");
            let raison = args.getString("raison");
            const member = message.guild.members.cache.get(user.id);

            if(!member)
                return bot.eph(bot, message, "Cet utilisateur n'est pas sur le serveur !");
            if(message.user.id === user.id)
                return bot.eph(bot, message, "Tu ne peux pas te warn toi même !");
            if(await bot.function.isAdministrator(member))
                return bot.eph(bot, message, "Les administrateurs du serveur ne peuvent pas être warn !");
            if(user.id === bot.monID)
                return bot.eph(bot, message, "Cette personne ne peut pas être mute !");
            if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)
                return bot.eph(bot, message, "Tu ne peux pas warn quelqu'un qui a un grade équivalent ou supérieur au tient !");
            if((await message.guild.members.fetchMe()).roles.highest.comparePositionTo(member.roles.highest) <= 0)
                return bot.eph(bot, message, "Le bot n'a pas la permission de warn cet utilisateur !");
        
            raison = bot.function.securiser(raison);
            message.guild.name = bot.function.securiser(message.guild.name);
            user.globalName = bot.function.securiser(user.globalName);
            message.user.globalName = bot.function.securiser(message.user.globalName);

            let ID = bot.function.createID("WARN", 10);

            db.query(`INSERT INTO warn (guildID, guildName, userID, userName, authorID, warnID, raison, date)
                VALUES (${message.guild.id}, '${message.guild.name}', ${user.id}, '${user.globalName}', ${message.user.id}, '${ID}', '${raison}', ${Date.now()})`);

            bot.msg(message, `L'utilisateur ${user} a bien été warn par ${message.user} pour cause de : ${raison}`);
            console.log(`L'utilisateur ${user.globalName} a bien été warn par ${message.user.globalName} pour cause de : ${raison}`);

            bot.function.mp(bot, user, `Tu a été warn du serveur ${message.guild.name} par ${message.user.globalName} pour la raison : '${raison}'`);

            db.query(`SELECT warnID FROM warn WHERE guildID = ${message.guild.id} AND userID = ${user.id}`, function (err, warn) {
                let nombre = warn.length;
                let temps = 24 * (nombre - 2);

                if(nombre >= 3 && nombre < 6)
                    return bot.function.mute(bot, message, user, `${temps}h`, `L'utilisateur ${user.globalName} a reçus ${nombre} warns !`);
                if(nombre >= 6)
                    return bot.function.ban(message, user, `L'utilisateur ${user.globalName} a reçus 6 warns`, bot);
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}