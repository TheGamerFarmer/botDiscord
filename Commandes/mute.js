const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name : "mute",
    description : "Mute un membre",
    longdescription: "Mute un membre. Le mute ne peut pas durée plus de 28 jours",
    permission : Discord.PermissionFlagsBits.ModerateMembers,
    dm : false,
    category: "Modération",
    
    options: [{
        type : "user",
        name : "membre",
        description : "Le membre à mute",
        required : true,
    }, {
        type : "string",
        name : "duree",
        description : "La durée du mute (ex: 1 heure 30 minutes, 1 heure=> 90m, 1h)",
        required : true,
        autocomplete: false,
        setMinLength: 0,
        setMaxLength: 20,
    }, {
        type : "string",
        name : "raison",
        description : "La raison du mute",
        required : true,
        autocomplete: false,
        setMinLength: 1,
        setMaxLength: 999,
    }],

    async run (bot, message, args){
        try{
            let user = args.getUser("membre");
            let time = args.getString("duree");
            let raison = args.getString("raison");
            const member = message.guild.members.cache.get(user.id);

            time = bot.function.securiser(time);

            if(!member)
                return bot.eph(bot, message, "Cet utilisateur n'est pas sur le serveur !");
            if(isNaN(ms(time)))
                return bot.eph(bot, message, "Le format de la durée du mute n'est pas correcte !");
            if(ms(time) > 2419199000) //Le mute ne peux pas durée plus de 28 jours
                return bot.eph(bot, message, "Le mute ne peux pas durée 28 jours ou plus !");
            if(message.user.id === user.id)
                return bot.eph(bot, message, "Tu ne peux pas te mute toi même !");
            if(bot.function.isAdministrator(member))
                return bot.eph(bot, message, "Les administrateurs du serveur ne peuvent pas être mute !");
            if(!member.moderatable || user.id === bot.monID)
                return bot.eph(bot, message, "Cette personne ne peut pas être mute !");
            if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)
                return bot.eph(bot, message, "Tu ne peux pas mute quelqu'un qui a un grade équivalent ou supérieur au tient !");
            if(member.isCommunicationDisabled())
                return bot.eph(bot, message, "Cet utilisateur est déjà mute !");

            raison = bot.function.securiser(raison);

            return bot.function.mute(bot, message, user, time, raison);
        }
        catch(error) {
            console.log(error);
            return bot.eph(bot, message, `La commande n'a pas marché !`);
        }
    },
}