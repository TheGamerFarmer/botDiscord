const Discord = require("discord.js");

module.exports = {
    event: "messageCreate",

    async run (bot, message) {
        if(message.channel.type === Discord.ChannelType.DM)
            return;

        await bot.function.initialisationServeur(bot, bot.db, "captcha", message.guild);

        await bot.function.initialisationServeur(bot, bot.db, "antiRaid", message.guild);

        await bot.function.initialisationServeur(bot, bot.db, "pick", message.guild);

        await bot.function.initialisationServeur(bot, bot.db, "notifChannel", message.guild);
    },
}