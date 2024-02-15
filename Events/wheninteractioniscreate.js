const Discord = require("discord.js");

module.exports = {
    event: "interactionCreate",

    async run (bot, interaction) {
        const db = bot.db

        interaction.user.globalName = bot.function.securiser(interaction.user.globalName);
        interaction.guild.name = bot.function.securiser(interaction.guild.name);

        if(interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete){
            let entry = interaction.options.getFocused();

            /*if(interaction.commandName === "help"){
                let choices = bot.commands.filter(cmd => cmd.name.includes(entry));
                await interaction.respond(entry === "" ? bot.commands.map(cmd =>({name: cmd.name, value: cmd.name})) : choices.map(choice => ({name: choice.name, value: choice.name})));
            }*/

            if(interaction.commandName === "unwarn"){
                db.query(`SELECT * FROM warn WHERE userID = ${interaction.options._hoistedOptions[0].value}`, async function(err, warns){
                    if(warns){
                        let choices = warns.filter(warn => warn.warnID.includes(entry));
                        await interaction.respond(entry === "" ? choices.map(warn =>({name: warn.raison, value: warn.warnID})) : choices.map(warn => ({name: warn.raison, value: warn.warnID})));
                    }
                });
            }
        }

        if(interaction.type === Discord.InteractionType.ApplicationCommand) {
            let command = bot.commands.get(interaction.commandName);
            command.run(bot, interaction, interaction.options, db);
        }

        if(interaction.isButton()){
            if(interaction.customId.startsWith("participation")){
                db.query(`SELECT * FROM blacklist WHERE guildID = ${interaction.guild.id} and userID = ${interaction.user.id}`, function (err, blacklist) {
                    if(blacklist.length > 0)
                        return bot.eph(bot, interaction, `Tu es blacklist pour la raison ${blacklist[0].raison}`);

                    const partieID = interaction.customId.slice("participation-".length, "participation-".length + 4);
                    const partieName = interaction.customId.slice("participation-".length + 5, interaction.customId.length);

                    const modal = new Discord.ModalBuilder()
                        .setCustomId(`confirmationParticipation-${partieID}-${partieName}`)
                        .setTitle("Confirme ta participation")
                        .addComponents([
                            new Discord.ActionRowBuilder().addComponents(
                                new Discord.TextInputBuilder()
                                    .setCustomId("pseudo")
                                    .setLabel("Ton pseudo minecraft")
                                    .setStyle(Discord.TextInputStyle.Short)
                                    .setMinLength(3)
                                    .setMaxLength(16)
                                    .setPlaceholder("TheGamerFarmer")
                                    .setRequired(true),
                            ),
                        ]);
                    interaction.showModal(modal);
                });
            }

            if(interaction.customId === "creationTicket"){
                let channel = await interaction.guild.channels.create({
                    name: `ticket ${interaction.user.globalName}`,
                    type: Discord.ChannelType.GuildText,
                    parent: interaction.channel.parent.id,
                    topic: interaction.user.id,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone.id,
                            deny: [Discord.PermissionFlagsBits.ViewChannel],
                        }, {
                            id: interaction.user.id,
                            allow: [
                                Discord.PermissionFlagsBits.ViewChannel,
                                Discord.PermissionFlagsBits.SendMessages,
                                Discord.PermissionFlagsBits.ReadMessageHistory,
                                Discord.PermissionFlagsBits.AttachFiles,
                                Discord.PermissionFlagsBits.EmbedLinks,
                            ],
                        },
                    ],
                });

                const embed = new Discord.EmbedBuilder()
                    .setColor(bot.color)
                    .setTitle("Fermer le ticket")
                    .setThumbnail(interaction.guild.iconURL())
                    .setTimestamp()
                    .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL()});

                const bouton = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("fermetureTicket")
                            .setLabel("Fermer le ticket")
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setEmoji("🔒")
                    );

                channel.send({embeds: [embed], components: [bouton]});

                return bot.eph(bot, interaction, `Votre ticket a bien été crée: ${channel}`);
            }

            if(interaction.customId === "fermetureTicket"){
                const user = interaction.channel.topic;
                await interaction.guild.channels.delete(interaction.channel.id);

                return bot.function.mp(bot, interaction.guild.members.cache.get(user), "Votre ticket a bien été fermé");
            }

            if(interaction.customId.startsWith("role-")){
                db.query(`SELECT * FROM notifRole_${interaction.guild.id}`, async function(err, notifRoles){
                    try{
                        const role = interaction.guild.roles.cache.get(notifRoles[notifRoles.findIndex(notifRole => interaction.customId.endsWith(notifRole.roleID))].roleID);
                        if(interaction.member.roles.cache.get(role.id)){
                            interaction.member.roles.remove(role);
                            console.log(`L'utilisateur ${interaction.user.globalName} s'est retiré le role ${role.name} sur le serveur ${interaction.guild.name}`);
                            return bot.eph(bot, interaction, `Vous n'avez plus le role ${role}`);
                        }
                        else{
                            interaction.member.roles.add(role);
                            console.log(`L'utilisateur ${interaction.user.globalName} s'est give le role ${role.name} sur le serveur ${interaction.guild.name}`);
                            return bot.eph(bot, interaction, `Vous avez maintenant le role ${role}`);
                        }
                    }
                    catch(e){console.log(e)}
                });
            }
        }

        if(interaction.type === Discord.InteractionType.ModalSubmit){
            if(interaction.customId.startsWith("confirmationParticipation")){
                const partieID = interaction.customId.slice("confirmationParticipation-".length, "confirmationParticipation-".length + 4);
                const partieName = interaction.customId.slice("confirmationParticipation-".length + 5, interaction.customId.length);
                let pseudo = interaction.fields.getTextInputValue("pseudo");

                pseudo = bot.function.securiser(pseudo);

                db.query(`SELECT * FROM blacklist WHERE guildID = ${interaction.guild.id} and pseudoMc = '${pseudo}'`, function (err, blacklist) {
                    if(blacklist.length > 0)
                        return bot.eph(bot, interaction, `Tu es blacklist pour la raison ${blacklist[0].raison}`)

                    db.query(`SELECT * FROM partie_${partieID}`, function (err, participants){
                        if(participants?.find(participant => interaction.user.id === participant.userID))
                            return bot.eph(bot, interaction, `Tu participe déjà à la partie ${partieName}!`);

                        db.query(`INSERT INTO party_${partyID} (userID, userName, pseudoMc)
                            VALUES (${interaction.user.id}, '${interaction.user.globalName}', '${pseudo}')`, function(){
                                console.log(`Le joueur ${interaction.user.globalName} rejoint la partie ${partyName}`);
                                return bot.eph(bot, interaction, `Ta participation a bien été enregistrée dans la partie ${partyName}!`);
                        });
                    });
                });
            }
        }
    },
}