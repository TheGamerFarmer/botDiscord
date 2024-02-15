const Discord = require("discord.js");

module.exports = {
    name: "clear",
    description: "Clear un Salon",
    longdescription: "Clear un Salon. Si aucun nombre n'est renseigné, alors 99 messages seront suprimés. Si aucun salon n'est renseigné, alors les messages seront supprimés dans le salon où la commande à été effectuée.",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    
    options: [{
        type: "number",
        name: "nombre",
        description: "Le nombre de message à supprimer (entre 1 et 99 inclus)",
        required: false,
        setMinValue: 1,
        setMaxValue: 99,
    }, {
        type: "channel",
        name: "salon",
        description: "Le salon à clear",
        required: false,
    }],

    async run(bot, message, args) {
        try{
            let channel = args.getChannel("salon");
            let number = args.getNumber("nombre");
            
            if(!number)
                number = 99;
            if(!channel)
                channel = message.channel;
            if(channel.id != message.channel.id && !message.guild.channels.cache.get(channel.id))
                return bot.eph(bot, message, "Aucun salon de ce nom trouvé !");

            channel.name = bot.function.securiser(channel.name);
            message.guild.name = bot.function.securiser(message.guild.name);

            try{
                let messages = await channel.bulkDelete(number);
                
                console.log(`Les ${messages.size} messages ont bien été supprimés dans le salon ${channel.name} sur le serveur ${message.guild.name} !`);
                return bot.eph(bot, message, `Les ${messages.size} messages ont bien été supprimés dans le salon ${channel} !`);
            }
            catch{
                let messages = [...(await channel.messages.fetch()).filter(msg => !msg.interaction && (Date.now() - msg.createdAt) <= 1209600000).values()];
                if(messages.length <= 0)
                    return bot.eph(bot, message, "Je ne peux pas supprimer les messages qui datent de plus de 14 jours !");
                
                await channel.bulkDelete(messages);
                
                console.log(`Les ${messages.length} messages qui dataient de moins de 14 jours ont bien été supprimés dans le salon ${channel.name} sur le serveur ${message.guild.name} !`);
                return bot.eph(bot, message, `Les ${messages.length} messages qui dataient de moins de 14 jours ont bien été supprimés dans le salon ${channel} !`);
            }
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}