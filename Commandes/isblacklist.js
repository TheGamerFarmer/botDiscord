const Discord = require("discord.js");

module.exports = {
    name: "isblacklist",
    description: "Vérifie si quelqu'un est dans la blacklist",
    longdescription: "Vérifie si quelqu'un est dans la blacklist et donne ses informations si il y est",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "UHC",

    options: [{
        type: "user",
        name: "membre",
        description: "Le membre dont on veut vérifier si il est blacklist",
        required: false,
    }, {
        type: "string",
        name: "pseudomc",
        description: "Le pseudo mc du membre dont on veut vérifier si il est blacklist",
        required: false,
        autocomplete: false,
        setMinLength: 1,
        setMaxLength: 16,
    }],

    async run(bot, message, args) {
        try{
            let user = args.getUser("membre");
            let pseudomc = args.getString("pseudomc");

            if(pseudomc)
                pseudomc = bot.function.securiser(pseudomc);
            if(user)
                user.globalName = bot.function.securiser(user.globalName);
            message.guild.name = bot.function.securiser(message.guild.name);

            if(!user && !pseudomc)
                return bot.eph(bot, message, "Tu dois renseigner au moins un pseudo mc ou un compte discord !");

            bot.db.query(`SELECT * FROM blacklist WHERE guildID = ${message.guild.id}`, function (err, blacklist) {
                let blacklisté = blacklist?.filter(blacklist2 => (user && user.id === blacklist2.userID) || pseudomc === blacklist2.pseudoMc);
                
                if(blacklisté?.length < 1)
                    return bot.eph(bot, message, "Cet utilisateur n'est pas blacklist !");

                let embed = new Discord.EmbedBuilder()
                    .setColor(bot.color)
                    .setTitle(`Affichage de la blacklist`)
                    .setThumbnail(message.guild.iconURL())
                    .setTimestamp()
                    .setFooter({text: "Affichage de la blacklist"});

                blacklisté.forEach(function (joueur) {                    
                    let utilisateur = message.guild.members.cache.get(joueur.userID);

                    embed.addFields({
                        name: `**${utilisateur ? utilisateur.user.globalName : joueur.pseudoMc}**`,
                        value: `Compte discord: ${utilisateur || "pas défini"}\npseudo mc: ${joueur.pseudoMc || "pas défini"}\nRaison: ${joueur.raison}`
                    });
                });

                return bot.msg(message, {embeds: [embed]});
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}