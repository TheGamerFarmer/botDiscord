module.exports = {
    event: "guildMemberAdd",

    async run (bot, member){
        bot.db.query(`SELECT * FROM antiRaid WHERE guildID = ${member.guild.id}`, async (err, antiRaid) => {
            if(!Boolean(antiRaid[0].isAntiRaid)){
                return bot.function.sendCaptcha(bot, member);
            }

            member.user.globalName = bot.function.securiser(member.user.globalName);

            bot.function.mp(bot, member.user, "Vous ne pouvez pas rejoindre ce serveur discord car il est en mode anti raid");
            member.kick("mode anti raide activé");
            return console.log(`L'utilisateur ${member.user.globalName} a bien été kick par ${bot.user.username} pour cause de : mode anti raid activé !`);
        });
    },
}