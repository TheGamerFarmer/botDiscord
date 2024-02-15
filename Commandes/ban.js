const Discord = require("discord.js");

module.exports = {
    name: "ban",
    description: "Ban un membre",
    permission: Discord.PermissionFlagsBits.BanMembers,
    dm: false,
    category: "Modération",
    
    options: [{
            type: "user",
            name: "membre",
            description: "Le membre à bannir",
            required: true,
        }, {
            type: "string",
            name: "raison",
            description: "La raison du bannissement",
            required: true,
            autocomplete: false,
            setMinLength: 1,
            setMaxLength: 999,
        }
    ],

    async run(bot, message, args) {
        try{
            let user = args.getUser("membre");
            let raison = args.getString("raison");
            const member = message.guild.members.cache.get(user.id);

            if(!member)
                return bot.eph(bot, message, "Cet utilisateur n'est pas sur le serveur !");
            if(message.user.id === user.id)
                return bot.eph(bot, message, "Tu ne peux pas te ban toi même !");
            if(bot.function.isAdministrator(member))
                return bot.eph(bot, message, "Les administrateurs du serveur ne peuvent pas être bannis !");
            if(!member.bannable || user.id === bot.monID)
                return bot.eph(bot, message, "Cette personne ne peut pas être bannie !");
            if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)
                return bot.eph(bot, message, "Tu ne peux pas bannir quelqu'un qui a un grade équivalent ou supérieur au tien !");
            if((await message.guild.bans.fetch()).get(user.id))
                return bot.eph(bot, message, "Cet utilisateur est déjà banni !");

            raison = bot.function.securiser(raison);

            return bot.function.ban(message, user, raison, bot);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}