module.exports = async function (bot, user, contenu) {
    try {
        user.globalName = await bot.function.securiser(user.globalName);
        await user.send(contenu);
    }
    catch(error) {
        console.log(`L'utilisateur ${user?.globalName} n'accepte pas les mp.`)
    };
}