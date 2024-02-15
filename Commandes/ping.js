module.exports = {
    name : "ping",
    description : "Affiche la latence",
    permission : "Aucune",
    dm : true,
    category: "Information",
    
    async run (bot, message){
        try{
            return bot.msg(message, `Ping : ${bot.ws.ping}`);
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}