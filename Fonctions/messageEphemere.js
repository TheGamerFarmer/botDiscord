module.exports = async function (bot, message, contenu){
    bot.msg(message, {content: contenu, ephemeral: true});
}