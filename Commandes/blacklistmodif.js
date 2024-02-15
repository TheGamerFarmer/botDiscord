const Discord = require("discord.js");

module.exports = {
    name: "blacklistmodif",
    description: "Modifier les informations de quelqu'un dans la blacklist",
    longdescription: "Modifier les informations de quelqu'un dans la blacklist, il faut renseigner la même chose que dans le /blacklistadd et les informations manquantes seront ajoutées. Si vous modifiez des informations déjà existantes, le bot se basera sur le pseudo discord pour les modifs. Si vous voulez modifier le pseudo discord d'un blacklisté, retirez-le de la blacklist et remettez-le",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "UHC",
    
    options: [{
            type: "user",
            name: "membre",
            description: "Le membre à compléter",
            required: true,
        },{
            type: "string",
            name: "pseudomc",
            description: "Le pseudo mc du joueur à compléter",
            required: true,
            autocomplete: false,
            setMinLength: 1,
            setMaxLength: 16,
        }
    ],

    async run(bot, message, args, db) {
        try{
            db.query(`SELECT * FROM pick WHERE guildID = ${message.guild.id}`, function (err, pick){
                let user = args.getUser("membre");
                let pseudomc = args.getString("pseudomc");
                if(!user || !pseudomc)
                    return bot.eph(bot, message, "Tu dois renseigner et le pseudo mc et le compte discord !");
                const member = message.guild.members.cache.get(user.id);
                const role = message.guild.roles.cache.get(pick[0].roleCanPickID);

                if(!role)
                    return bot.eph(bot, message, "Aucun role n'a été défini comme étant le role minimum pour pouvoir gérer les picks !");
                if(message.member.roles.highest.comparePositionTo(role) < 0)
                    return bot.eph(bot, message, "Vous n'avez pas la permission d'utiliser cette commande !");
                if(message.user.id === user.id)
                    return bot.eph(bot, message, "Tu ne peux pas te blacklist toi même !");
                if(bot.function.isAdministrator(member))
                    return bot.eph(bot, message, "Les administrateurs du serveur ne peuvent pas être blacklist !");
                if(user.id === bot.monID)
                    return bot.eph(bot, message, "Cette personne ne peut pas être blacklist !");
                if(message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0)
                    return bot.eph(bot, message, "Tu ne peux pas blacklist quelqu'un qui a un grade équivalent ou supérieur au tien !");

                user.globalName = bot.function.securiser(user.globalName);
                pseudomc = bot.function.securiser(pseudomc);
                message.guild.name = bot.function.securiser(message.guild.name);
                
                db.query(`SELECT * FROM blacklist WHERE guildID = ${message.guild.id} AND (userID = ${user.id} OR pseudoMc = '${pseudomc}')`, function (err2, blacklist) {
                    if(blacklist.length < 1)
                        return bot.eph(bot, message, "Aucune de ces infos ne correspond avec une personne dans la blacklist !")

                    if(user.id === blacklist[0].userID && pseudomc === blacklist[0].pseudoMc)
                        return bot.eph(bot, message, "Cet utilisateur a déjà ces informations !");

                    if(!blacklist[0].userID){
                        db.query(`UPDATE blacklist SET userID = ${user.id}, userName = '${user.globalName}' WHERE guildID = ${message.guild.id} AND pseudoMc = '${pseudomc}'`);

                        console.log(`Le compte discord ${user.globalName} a bien été ajouté au joueur dont le pseudo mc est ${pseudomc} sur la blacklist du serveur ${message.guild.name}`);
                        bot.function.mp(bot, user, `Ton compte discord a été affecté au pseudo minecraft ${pseudomc} qui est blacklist du serveur ${message.guild.name}`);
                        return bot.msg(message, `Le compte discord ${user} a bien été ajouté au joueur dont le pseudo mc est ${pseudomc}`);
                    }
                    else{
                        db.query(`UPDATE blacklist SET pseudoMc = '${pseudomc}' WHERE guildID = ${message.guild.id} AND userID = ${user.id}`);

                        console.log(`Le pseudo mc ${pseudomc} a bien été affecté au joueur ${user.globalName} sur la blacklist du serveur ${message.guild.name}`);
                        bot.function.mp(bot, user, `Ton compte discord à été affecté au pseudo minecraft ${pseudomc} qui est blacklist du serveur ${message.guild.name}`);
                        return bot.msg(message, `Le pseudo mc ${pseudomc} a bien été affecté au joueur ${user}`);
                    }
                });
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}