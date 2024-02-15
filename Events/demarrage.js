const loadDatabase = require ("../Loaders/loadDatabase");
const loadSlashCommands = require("../Loaders/loadSlashCommandes");

module.exports = {
    event: "ready",

    async run (bot) {
        bot.db = loadDatabase.getDb();
        await loadDatabase.connectAndTry();

	    setInterval(() => {bot.db && bot.db.query("SELECT count(*) FROM captcha")}, 20000);
	
        await loadSlashCommands(bot);
        console.log(`${bot.user.username} est bien en ligne`);
    },
}
