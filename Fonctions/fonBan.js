module.exports = async function (message, user, raison, bot){
    message.guild.name = bot.function.securiser(message.guild.name);
    message.user.globalName = bot.function.securiser(message.user.globalName);
    user.globalName = bot.function.securiser(user.globalName);

    await bot.function.mp(bot, user, `Tu as été bannis du serveur ${message.guild.name} par ${message.user.globalName} pour la raison : "${raison}"`);
    await message.guild.bans.create(user.id, {reason: raison});

    console.log(`L'utilisateur ${user.globalName} a bien été bannie du serveur ${message.guild.name} par ${message.user.globalName} pour cause de: ${raison}`);
    return bot.msg(message, `L'utilisateur ${user.globalName} a bien été bannie par ${message.user.globalName} pour cause de: ${raison}`);
};