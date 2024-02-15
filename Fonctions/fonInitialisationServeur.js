module.exports = async function(bot, db, table , guild) {
    guild.name = bot.function.securiser(guild.name);

    db.query(`SELECT * FROM ${table} WHERE guildID = ${guild.id}`, async (err, dbTable) => {
        if(dbTable?.length < 1)
            db.query(`INSERT INTO ${table} (guildID, guildName) VALUES (${guild.id}, '${guild.name}')`);
    });
}