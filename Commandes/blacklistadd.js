const Discord = require("discord.js");

module.exports = {
    name: "blacklistadd",
    description: "Ajouter quelqu'un à la blacklist",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "UHC",
    
    options: [{
            type: "string",
            name: "raison",
            description: "La raison du blacklist",
            required: true,
            autocomplete: false,
            setMinLength: 1,
            setMaxLength: 999,
        }, {
            type: "user",
            name: "membre",
            description: "Le membre à blacklist",
            required: false,
        }, {
            type: "string",
            name: "pseudomc",
            description: "Le pseudo mc du joueur à blacklist",
            required: false,
            autocomplete: false,
            setMinLength: 1,
            setMaxLength: 16,
        }
    ],

    async run(bot, message, args, db) {
        try{
            db.query(`SELECT * FROM pick WHERE guildID = ${message.guild.id}`, function (err, pick){
                let user = args.getUser("membre");
                let raison = args.getString("raison");
                let pseudomc = args.getString("pseudomc");
                const role = message.guild.roles.cache.get(pick[0].roleCanPickID);
                const member = message.guild.members.cache.get(user?.id);
                
                if(!role)
                    return bot.eph(bot, message, "Aucun role n'a été défini comme étant le role minimum pour pouvoir gérer les picks !");
                if(message.member.roles.highest.comparePositionTo(role) < 0)
                    return bot.eph(bot, message, "Vous n'avez pas la permission d'utiliser cette commande !");
                if(!user && !pseudomc)
                    return bot.eph(bot, message, "Tu dois renseigner soit le pseudo mc soit le compte discord !");
                if(user){
                    if(!member)
                        return bot.eph(bot, message, "L'utilisateur n'est pas sur le serveur !");
                    if(message.user.id === user.id)
                        return bot.eph(bot, message, "Tu ne peux pas te blacklist toi-même !");
                    if(bot.function.isAdministrator(member))
                        return bot.eph(bot, message, "Les administrateurs du serveur ne peuvent pas être blacklist !");
                    if(user.id === bot.monID)
                        return bot.eph(bot, message, "Cette personne ne peut pas être blacklist !");
                    if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)
                        return bot.eph(bot, message, "Tu ne peux pas blacklist quelqu'un qui a un grade équivalent ou supérieur au tien !");
                }

                raison = bot.function.securiser(raison);
                if(pseudomc)
                    pseudomc = bot.function.securiser(pseudomc);
                if(user)
                    user.globalName = bot.function.securiser(user.globalName);
                message.user.globalName = bot.function.securiser(message.user.globalName);
                message.guild.name = bot.function.securiser(message.guild.name);

                db.query(`SELECT * FROM blacklist WHERE guildID = ${message.guild.id}`, function (err, blacklist) {
                    if(blacklist?.find(blacklist2 => (user && user.id === blacklist2.userID) || pseudomc === blacklist2.pseudoMc))
                        return bot.eph(bot, message, "Cet utilisateur est déjà blacklist !");
                    
                    db.query(`INSERT INTO blacklist (guildID, guildName, blacklisterUserID, blacklisterUserName, ${user ? "userID, userName, " : ""}${pseudomc ? "pseudoMc, " : ""}raison)
                        VALUES (${message.guild.id}, '${message.guild.name}', ${message.user.id}, '${message.user.globalName}', ${user ? `${user.id}, '${user.globalName}', ` : ""}${pseudomc ? `'${pseudomc}', ` : ""}'${raison}')`);
                    
                    bot.function.mp(bot, user, `Tu as été blacklist du serveur ${message.guild.name} par ${message.user.globalName} pour la raison: "${raison}"`);

                    console.log(`Le joueur ${user?.globalName || ""} ${pseudomc ?
                        `dont le pseudo mc est ${pseudomc}` : ""} a bien été ajouté à la blacklist du serveur ${message.guild.name} pour la raison: ${raison} !`);
                    return bot.msg(message, `Le joueur ${user || ""} ${pseudomc ?
                        `dont le pseudo mc est ${pseudomc}` : ""} a bien été ajouté à la blacklist pour la raison: ${raison} !`);
                });
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}