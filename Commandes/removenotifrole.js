const Discord = require("discord.js");

module.exports = {
    name: "removenotifrole",
    description: "Retire un role de notification",
    longdescription: "Retire un role de notification que les utilisateurs peuvent se give dans le channel défini par le /setnotifchannel (ATTENTION le salon est clear à chaque utilisation de la commande)",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Configuration",
    
    options: [{
        type: "role",
        name: "role",
        description: "Le role que les utilisateurs ne pourront plus se give",
        required: true,
    }],

    async run(bot, message, args, db) {
        try{
            let role = args.getRole("role");

            db.query(`SELECT * FROM notifChannel WHERE guildID = ${message.guild.id}`, function (err, notifChannel){
                if(!notifChannel[0].notifChannelID)
                    return bot.eph(Discord.WorkerBootstrapper, message, "Vous n'avez pas définie de salon dans le /setnotifchannel !");

                const channel = message.guild.channels.cache.get(notifChannel[0].notifChannelID);

                db.query(`SELECT * FROM notifRole_${message.guild.id}`, async function(err2, notifRoles){
                    if(!notifRoles.find(ancientRole => role.id === ancientRole.roleID))
                        return bot.eph(bot, message, `Le role ${role} n'est pas dans les roles que les utilisateurs peuvent se givent !`);
                    if(notifRoles.length <= 1){
                        await channel.bulkDelete(99);
                        
                        db.query(`DELETE FROM notifRole_${message.guild.id} WHERE roleID = ${role.id}`);

                        return bot.eph(bot, message, `Le role ${role} à bien été retirer des roles que les utilisateurs peuvent se givent !`);
                    }

                    db.query(`DELETE FROM notifRole_${message.guild.id} WHERE roleID = ${role.id}`);

                    await channel.bulkDelete(99);

                    db.query(`SELECT * FROM notifRole_${message.guild.id}`, async function(err2, notifRoles2){
                        const embed = new Discord.EmbedBuilder()
                            .setColor(bot.color)
                            .setTitle("Roles de notification")
                            .setThumbnail(message.guild.iconURL())
                            .setDescription("Pour être informé des différents événements, des rôles sont mis à disposition pour être notifié en temps réel:")
                            .setTimestamp()
                            .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL()});
                        
                        let boutonList = [];
                        
                        notifRoles2.forEach(function (notifRole) {
                            embed.addFields({name: notifRole.roleName, value: notifRole.roleDescription})
                            
                            boutonList.push(new Discord.ActionRowBuilder()
                                .addComponents(new Discord.ButtonBuilder()
                                    .setCustomId(`role-${notifRole.roleID}`)
                                    .setLabel(notifRole.roleName)
                                    .setStyle(Discord.ButtonStyle.Secondary)
                                )
                            );
                        });

                        channel.send({embeds: [embed], components: boutonList});

                        return bot.eph(bot, message, `Le role ${role} à bien été retirer des roles que les utilisateurs peuvent se givent !`);
                    });
                });
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}