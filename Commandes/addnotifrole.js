const Discord = require("discord.js");

module.exports = {
    name: "addnotifrole",
    description: "Ajoute un role de notification",
    longdescription: "Ajoute un role de notification que les utilisateurs peuvent se give dans le channel défini par le /setnotifchannel (ATTENTION le salon est clear à chaque utilisation de la commande)",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    dm: false,
    category: "Configuration",
    
    options: [{
        type: "role",
        name: "role",
        description: "Le role que les utilisateurs pourront se give",
        required: true,
    }, {
        type: "string",
        name: "description",
        description: "Description du role",
        required: true,
        autocomplete: false,
        setMinLength: 5,
        setMaxLength: 60,
    }],

    async run(bot, message, args, db) {
        try{
            let role = args.getRole("role");
            let description = args.getString("description");

            db.query(`SELECT * FROM notifChannel WHERE guildID = ${message.guild.id}`, function (err, notifChannel){
                if(!notifChannel[0].notifChannelID)
                    return bot.eph(bot, message, "Vous n'avez pas défini de salon dans le /setnotifchannel !");
                
                const channel = message.guild.channels.cache.get(notifChannel[0].notifChannelID);

                description = bot.function.securiser(description);
                role.name = bot.function.securiser(role.name);
                message.guild.name = bot.function.securiser(message.guild.name);

                db.query(`SELECT * FROM notifRole_${message.guild.id}`, async function(err2, notifRoles){
                    if(notifRoles.length > 4)
                        return bot.eph(bot, message, "Il ne peut pas y avoir plus de 5 roles que les utilisateurs peuvent se give !");
                    if(notifRoles.find(ancientRole => role.id === ancientRole.roleID))
                        return bot.eph(bot, message, `Le role ${role} est déjà dans les roles que les utilisateurs peuvent se give !`);
                    if((await message.guild.members.fetchMe()).roles.highest.comparePositionTo(role) <= 0)
                        return bot.eph(bot, message, "Le bot ne peut pas give ce role !");

                    db.query(`INSERT INTO notifRole_${message.guild.id} (roleID, roleName, roleDescription) VALUES (${role.id}, '${role.name}', '${description}')`);

                    await channel.bulkDelete(99);

                    const embed = new Discord.EmbedBuilder()
                        .setColor(bot.color)
                        .setTitle("Roles de notification")
                        .setThumbnail(message.guild.iconURL())
                        .setDescription("Pour être informé des différents événements, des rôles sont mis à disposition pour être notifié en temps réel:")
                        .addFields({name: role.name, value: description})
                        .setTimestamp()
                        .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL()});
                    
                    let boutonList = [new Discord.ActionRowBuilder()
                        .addComponents(new Discord.ButtonBuilder()
                            .setCustomId(`role-${role.id}`)
                            .setLabel(role.name)
                            .setStyle(Discord.ButtonStyle.Secondary)
                        )
                    ];
                    
                    notifRoles.forEach(function (notifRole) {
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

                    return bot.eph(bot, message, `Le role ${role} a bien été ajouté aux roles que les utilisateurs peuvent se give !`);
                });
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}