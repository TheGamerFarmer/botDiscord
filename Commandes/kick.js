const Discord = require("discord.js");

module.exports = {
    name: "kick",
    description: "Kick un membre",
    permission: Discord.PermissionFlagsBits.KickMembers,
    dm: false,
    category: "Modération",
    
    options: [{
            type: "user",
            name: "membre",
            description: "Le membre a kick",
            required: true,
        }, {
            type: "string",
            name: "raison",
            description: "La raison du kick",
            required: true,
            autocomplete: false,
            setMinLength: 1,
            setMaxLength: 999,
        },
    ],

    async run(bot, message, args) {
        try{
            let user = args.getUser("membre");
            let raison = args.getString("raison");
            const member = message.guild.members.cache.get(user.id);
            
            if(!member)
                return bot.eph(bot, message, "Cet utilisateur n'est pas sur le serveur !");
            if(message.user.id === user.id)
                return bot.eph(bot, message, "Tu ne peux pas te kick toi même !");
            if(bot.function.isAdministrator(member))
                return bot.eph(bot, message, "Les administrateurs du serveur ne peuvent pas être kick !");
            if((await message.guild.fetchOwner()).id === user.id)
                return bot.eph(bot, message, "Le propriétaire du serveur ne peux pas être kick !");
            if(!member.kickable || user.id === bot.monID)
                return bot.eph(bot, message, "Cette personne ne peut pas être kick !");
            if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)
                return bot.eph(bot, message, "Tu ne peux pas kick quelqu'un qui a un grade équivalent ou supérieur au tient !");

            raison = bot.function.securiser(raison);
            message.user.globalName = bot.function.securiser(message.user.globalName);
            user.globalName = bot.function.securiser(user.globalName);
            message.guild.name = bot.function.securiser(message.guild.name);

            bot.function.mp(bot, user, `Tu a été kick du serveur ${message.guild.name} par ${message.user.globalName} pour la raison : "${raison}"`);
            
            member.kick(raison);
            
            console.log(`L'utilisateur ${user.globalName} a bien été kick par ${message.user.globalName} pour cause de : ${raison}`);
            return bot.msg(message, `L'utilisateur ${user.globalName} a bien été kick par ${message.user.globalName} pour cause de : ${raison}`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}