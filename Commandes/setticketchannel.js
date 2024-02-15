const Discord = require("discord.js");

module.exports = {
    name: "setticketchannel",
    description: "Set le salon où les ticket pourront être crée",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Configuration",
    
    options: [{
        type: "channel",
        name: "channel",
        description: "Le salon où les picks pourrons avoir lieux",
        required: false,
    }],

    async run(bot, message, args) {
        try{
            let channel = args.getChannel("channel");
            if(!channel)
                channel = message.channel;

            channel.name = bot.function.securiser(channel.name);
            message.guild.name = bot.function.securiser(message.guild.name);

            const embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle("Ouvrir d'un ticket")
                .setDescription(`Vous avez un problème ?\n\nCliquez sur le bouton pour créer un ticket et nous contacter.\nNous vous recontacterons le plus brièvement possible.`)
                .setThumbnail(message.guild.iconURL())
                .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL()});
            
            const bouton = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`creationTicket`)
                        .setLabel("Créer un ticket")
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setEmoji("✉️")
                );

            console.log(`Le salon ou les ticket seront désormais crées sur le serveur ${message.guild.name} est ${channel.name}`);
            return bot.msg({channel: channel}, {embeds: [embed], components: [bouton]});
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}