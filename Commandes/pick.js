const Discord = require("discord.js");

module.exports = {
    name: "pick",
    description: "Pick un certain nombre de joueurs",
    longdescription: "Pick un certain nombre de joueurs, fournit leur pseudo discord ainsi que leur pseudo minecraft, peut donner un role aux sélectionnés si ce dernier est renseigné",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "UHC",
    
    options: [{
        type: "number",
        name: "nombre",
        description: "Le nombre de joueurs à pick",
        required: true,
        setMinValue: 1,
        setMaxValue: 999,
    }],

    async run(bot, message, args, db) {
        try{
            const nombre = args.getNumber("nombre");
            let selectionnes = [];

            db.query(`SELECT * FROM pick WHERE guildID = ${message.guild.id}`, function (err, pick){
                const role = message.guild.roles.cache.get(pick[0].roleCanPickID);

                if(!role)
                    return bot.eph(bot, message, "Aucun role n'a été défini comme étant le role minimum pour pouvoir gérer les picks !");
                if(message.guild.members.cache.get(message.user.id).roles.highest.comparePositionTo(role) < 0)
                    return bot.eph(bot, message, "Vous n'avez pas la permission d'utiliser cette commande !");
                if(pick[0].pickChannelID !== message.channel.id)
                    return bot.eph(bot, message, "Vous n'êtes pas dans le salon autorisé pour les picks !");

                db.query(`SELECT * FROM partie_${pick[0].partieID}`, async function (err2, participants){
                    if(nombre > participants.length)
                        return bot.eph(bot, message, `Il n'y a pas autant de participants !\nLe nombre de participants est actuellement de ${participants.length}`);
                    
                    for(let i = 0 ; i < nombre ; i ++){
                        let random = Math.floor(Math.random() * participants.length);
                        selectionnes.push(participants[random]);
                        delete participants[random];
                        participants = participants.flat();
                    }

                    selectionnes.forEach(selectionne =>{
                        selectionne.user = message.guild.members.cache.get(selectionne.userID)
                        if(pick[0].rolePicksID)
                            selectionne.user.roles.add(pick[0].rolePicksID);
                        db.query(`DELETE FROM partie_${pick[0].partieID} WHERE userID = ${selectionne.userID}`);
                    });

                    db.query(`UPDATE pick SET nombreMessages = ${pick[0].nombreMessages + nombre + 1}`)

                    console.log(`Les joueurs sélectionnés sont:`)
                    bot.msg(message, `Les joueurs sélectionnés sont:`);

                    return selectionnes.forEach(participant => {
                        console.log(`${participant.userName} pseudo mc: ${participant.pseudoMc}`)
                        bot.msg(message, `${participant.user} pseudo mc: ${participant.pseudoMc}`);
                    });
                });
            });
        }
        catch (error) {
            console.log(error);
            return bot.eph(bot, message, "La commande n'a pas marché !");
        }
    },
}