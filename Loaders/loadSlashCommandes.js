const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");

module.exports = async bot => {
    let commands =[];

    bot.commands.forEach(command => {
        let slashcommand = new Discord.SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDMPermission(command.dm)
            .setDefaultMemberPermissions(command.permission === "Aucune" ? null : command.permission);

        command.options?.forEach(function (opts) {
            {slashcommand[`add${opts.type.slice(0, 1).toUpperCase() + opts.type.slice(1, opts.type.length)}Option`](option => {
                let opt = option.setName(opts.name).setDescription(opts.description).setRequired(opts.required);

                if (opts.type === "string")
                    opt.setMinLength(opts.setMinLength)
                        .setMaxLength(opts.setMaxLength)
                        .setAutocomplete(opts.autocomplete);

                if (opts.type === "number")
                    opt.setMinValue(opts.setMinValue)
                        .setMaxValue(opts.setMaxValue);
                
                return opt;
            })};
        });
        
        commands.push(slashcommand);
    });

    const rest = new REST({version : "10"}).setToken(bot.token);
    
    await rest.put(Routes.applicationCommands(bot.user.id), {body: commands});
    console.log("Les slashs commandes sont crée avec succès");
}