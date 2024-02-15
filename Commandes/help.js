const Discord = require("discord.js");

module.exports = {
    name: "help",
    description: "Affiche les commandes",
    longdescription: "Affiche les commandes. Si une commandes est renseignée, vous obtiendrez les détailles de cette commande avec une meilleur descriptions.",
    permission: "Aucune",
    dm: true,
    category: "Information",

    options: [{
        type: "string",
        name: "commande",
        description: "La commande a afficher",
        required: false,
        autocomplete: true,
        setMinLength: 1,
        setMaxLength: 99,
    }],
    
    async run (bot, message, args){
        try{
            let commande = args.getString("commande");

            if (commande)
                commande = bot.function.securiser(commande);

            const command = bot.commands.get(commande);

            if(commande){
                if(!command)
                    return bot.eph(bot, eph, "Il n'y a aucune commande de ce nom !");

                let Embed = new Discord.EmbedBuilder()
                    .setColor(bot.color)
                    .setTitle(`Commandes ${command.name}`)
                    .setTimestamp()
                    .setFooter({text: "Commandes d'UHC pick"})
                    .setDescription(`**Nom:** ${command.name}\n\n**Description:** ${command.longdescription || command.description}\n\n**Permissions requise:** ${typeof command.permission !== "bigint" ?
                        command.permission: new Discord.PermissionsBitField(command.permission).toArray(false)}\n\n**Commande en DM:** ${command.dm ? "oui" : "non"}\n\n**Catégorie:** ${command.category}`);

                return bot.msg(message, {embeds: [Embed]});
            }
            else {
                let categories = [];

                bot.commands.forEach(command => {
                    if(!categories.includes(command.category))
                        categories.push(command.category);
                });

                let Embed = new Discord.EmbedBuilder()
                    .setColor(bot.color)
                    .setTitle(`Commandes du bot`)
                    .setThumbnail(bot.user.displayAvatarURL())
                    .setDescription(`Commandes disponible ${bot.commands.size}. Catégories disponnibles : ${categories.length}`)
                    .setTimestamp()
                    .setFooter({text: "Commandes d'UHC pick"});

                categories.sort().forEach(function (cat) {
                    let commands = bot.commands.filter(cmd => cmd.category === cat);

                    Embed.addFields({name: `**${cat}**`, value: `${commands.map(cmd => `***${cmd.name} :*** *${cmd.description}*`).join("\n")}\n${"-".repeat(68)}`});
                });

                return bot.msg(message, {embeds: [Embed]});
            }
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}