let ms = require("ms");

module.exports = async function mute (bot, message, user, time, raison){    
    message.user.globalName = bot.function.securiser(message.user.globalName);
    user.globalName = bot.function.securiser(user.globalName);
    message.guild.name = bot.function.securiser(message.guild.name);

    await message.guild.members.cache.get(user.id).timeout(ms(time), raison);

    console.log(`L'utilisateur ${user.globalName} a bien été mute par ${message.user.globalName} pendant ${time} pour cause de : ${raison}`);
    bot.function.mp(bot, user, `Tu a été mute du serveur ${message.guild.name} par ${message.user.globalName} pendant ${time} pour la raison : "${raison}"`);
    return bot.msg(message, `L'utilisateur ${user.globalName} a bien été mute par ${message.user.globalName} pendant ${time} pour cause de : ${raison}`);
};