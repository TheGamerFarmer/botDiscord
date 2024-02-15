const Discord = require("discord.js");

module.exports = {
    name : "unmute",
    description : "unMute un membre",
    permission : Discord.PermissionFlagsBits.ModerateMembers,
    dm : false,
    category: "Modération",
    
    options: [{
        type : "user",
        name : "membre",
        description : "Le membre à unmute",
        required : true,
    }, {
        type : "string",
        name : "raison",
        description : "La raison du unmute",
        required : true,
        autocomplete: false,
        setMinLength: 1,
        setMaxLength: 999,
    }],

    async run (bot, message, args){
        try{
            let user = args.getUser("membre");
            let raison = args.getString("raison");
            const member = message.guild.members.cache.get(user.id);
            
            if(message.user.id === user.id)
                return bot.eph(bot, message, "Tu ne peux pas te unmute toi même !");
            if(!member.moderatable)
                return bot.eph(bot, message, "Cette personne ne peut pas être unmute !");
            if(!member.isCommunicationDisabled())
                return bot.eph(bot, message, "Cet utilisateur n'est pas mute !");

            raison = bot.function.securiser(raison);
            message.user.globalName = bot.function.securiser(message.user.globalName);
            user.globalName = bot.function.securiser(user.globalName);
            message.guild.name = bot.function.securiser(message.guild.name);

            member.timeout(null, raison);
            
            console.log(`L'utilisateur ${user.globalName} a bien été unmute par ${message.user.globalName} pour cause de : ${raison}`);
            bot.function.mp(bot, user, `Tu a été unmute du serveur ${message.guild.name} par ${message.user.globalName} pour la raison : "${raison}"`);
            return bot.msg(message, `L'utilisateur ${user.globalName} a bien été unmute par ${message.user.globalName} pour cause de : ${raison}`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}