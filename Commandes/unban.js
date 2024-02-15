const Discord = require("discord.js");

module.exports = {
    name: "unban",
    description: "unBan un utilisateur",
    longdescription: "unBan un utilisateur. Si l'utilisateur n'est plus renseigné sur le serveur, on peut renseignée l'ID de l'utilisateur.",
    permission: Discord.PermissionFlagsBits.unBanMembers,
    dm: false,
    category: "Modération",
    
    options: [{
            type: "user",
            name: "membre",
            description: "Le membre a unbannir",
            required: true,
        }, {
            type: "string",
            name: "raison",
            description: "La raison du unbannissement",
            required: true,
            autocomplete: false,
            setMinLength: 1,
            setMaxLength: 999,
        },
    ],

    async run(bot, message, args) {
        try{
            let user = await bot.users.fetch(args._hoistedOptions[0].value);
            let raison = args.getString("raison");
            
            if(!(await message.guild.bans.fetch()).get(user.id))
                return bot.eph(bot, message, "Cet utilisateur n'est pas ban !");

            raison = bot.function.securiser(raison);
            message.user.globalName = bot.function.securiser(message.user.globalName);
            message.guild.name = bot.function.securiser(message.guild.name);
            user.globalName = bot.function.securiser(user.globalName);
   
            message.guild.members.unban(user, raison);
            
            bot.function.mp(bot, user, `Tu as été unban du serveur ${message.guild.name} par ${message.user.globalName} pour la raison : "${raison}"`);
            console.log(`L'utilisateur ${user.globalName} a bien été unban par ${message.user.globalName} pour cause de : ${raison}`);
            return bot.msg(message, `L'utilisateur ${user.globalName} a bien été unban par ${message.user.globalName} pour cause de : ${raison}`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}