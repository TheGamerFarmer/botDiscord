module.exports = async function (msg, contenu){
    try{await msg.reply(contenu)}
        catch(e) {msg.channel.send(contenu)}
};