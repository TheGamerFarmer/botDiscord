const Discord = require("discord.js");

module.exports = {
    name: "startpick",
    description: "Lance un évènement où les gens peuvent s'inscrire",
    longdescription: "Lance un évènement où les gens peuvent s'inscrire, l'inscription nécessite le pseudo minecraft (un seul pick peux être lancé simultanément par serveur)",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "UHC",
    
    options: [{
        type: "string",
        name: "titre",
        description: "Le titre du message du pick",
        required: true,
        autocomplete: false,
        setMinLength: 1,
        setMaxLength: 50,
    }, {
        type: "string",
        name: "contenu",
        description: "Le texte à afficher dans le message du pick",
        required: true,
        autocomplete: false,
        setMinLength: 1,
        setMaxLength: 999,
    }, {
        type: "role",
        name: "role1",
        description: "Le premier role à mentionner",
        required: true,
    }, {
        type: "role",
        name: "role2",
        description: "Le deuxième role à mentionner",
        required: false,
    }, {
        type: "role",
        name: "role3",
        description: "Le troisième role à mentionner",
        required: false,
    }, {
        type: "role",
        name: "role4",
        description: "Le quatrième role à mentionner",
        required: false,
    }, {
        type: "role",
        name: "role5",
        description: "Le cinquième role à mentionner",
        required: false,
    }],

    async run(bot, message, args, db) {
        try{
            db.query(`SELECT * FROM pick WHERE guildID = ${message.guild.id}`, function (err, pick) {
                let role1 = args.getRole("role1");
                let role2 = args.getRole("role2");
                let role3 = args.getRole("role3");
                let role4 = args.getRole("role4");
                let role5 = args.getRole("role5");
                let titre = args.getString("titre");
                let contenu = args.getString("contenu");
                const partieID = bot.function.createID("participation", 4);
                const role = message.guild.roles.cache.get(pick[0].roleCanPickID);

                if(!role)
                    return bot.eph(bot, message, "Aucun role n'a été défini comme étant le role minimum pour pouvoir gérer les picks !");
                if(message.guild.members.cache.get(message.user.id).roles.highest.comparePositionTo(role) < 0)
                    return bot.eph(bot, message, "Vous n'avez pas la permission d'utiliser cette commande !");
                if(pick[0].pickChannelID !== message.channel.id)
                    return bot.eph(bot, message, "Vous n'êtes pas dans le salon autorisé pour les picks !");
                if(pick[0].partieID)
                    return bot.eph(bot, message, "Il y a déjà une partie de lancée !");

                titre = bot.function.securiser(titre);
                contenu = bot.function.securiser(contenu);
                message.guild.name = bot.function.securiser(message.guild.name);
                role1.name = bot.function.securiser(role1.name);
                if(role2)
                    role2.name = bot.function.securiser(role2.name);
                if(role3)
                    role3.name = bot.function.securiser(role3.name);
                if(role4)
                    role4.name = bot.function.securiser(role4.name);
                if(role5)
                    role5.name = bot.function.securiser(role5.name);

                let Embed = new Discord.EmbedBuilder()
                    .setColor(bot.color)
                    .setTitle(`${titre}`)
                    .setThumbnail(message.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL()})
                    .setDescription(`||${role1}${role2 || ""}${role3 || ""}${role4 || ""}${role5 || ""}||\n
                        **${contenu}**`);

                const bouton = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId(`${partieID}-${titre}`)
                            .setLabel("Participer")
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setEmoji("⚔️")
                    );

                db.query(`UPDATE pick SET
                    partieID = '${partieID.slice("participation-".length, partieID.length)}',
                    partieName = '${titre}',
                    nombreMessages = ${pick[0].nombreMessages + 1} WHERE guildID = ${message.guild.id}`);

                db.query(`CREATE TABLE partie_${partieID.slice("participation-".length, partieID.length)}(
                    guildID varchar(255) DEFAULT ${message.guild.id} NOT NULL,
                    guildName text(255) DEFAULT '${message.guild.name}' NOT NULL,
                    partieID varchar(255) DEFAULT '${partieID.slice("participation-".length, partieID.length)}' NOT NULL,
                    partieName text(255) DEFAULT '${titre}' NOT NULL,
                    userID varchar(255) PRIMARY KEY NOT NULL,
                    userName text(255) NOT NULL,
                    pseudoMc text(255) NOT NULL
                    ) ENGINE=InnoDB DEFAULT charset=utf8mb4 COLLATE=utf8mb4_general_ci;`);

                console.log(`La partie ${titre} a bien été créée`);
                return bot.msg(message, {embeds: [Embed], components: [bouton]});
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}