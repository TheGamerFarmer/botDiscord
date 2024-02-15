const config = require("../config");

module.exports ={
    event: "guildMemberRemove",

    async run (bot, ban) {
        let db = bot.db;

        db.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = '${config.dbinfo.database}'`, function (err, tables) {
            tables.forEach(table => {
                if(table.table_name === "blacklist"){
                    db.query(`SELECT * FROM blacklist WHERE guildID = ${ban.guild.id} AND userID = ${ban.user.id}`, function(err, blacklist){
                        if(blacklist[0]?.pseudoMc)
                            db.query(`UPDATE blacklist SET userID = "", userName = "" WHERE guildID = ${ban.guild.id} AND userID = ${ban.user.id}`);
                        else
                            db.query(`DELETE FROM blacklist WHERE guildID = ${ban.guild.id} AND userID = ${ban.user.id}`);
                    });
                }
                else
                    db.query(`DELETE FROM ${table.table_name} WHERE guildID = ${ban.guild.id} AND userID = ${ban.user.id}`, () => {});
            });
        });
    },
}