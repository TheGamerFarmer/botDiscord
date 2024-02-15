const fs = require("fs");

module.exports = async bot => {
    fs.readdirSync("./Events").filter(f => f.endsWith(".js"))
        .forEach(async file => {
            let happening = require(`../Events/${file}`);
            bot.on(happening.event, happening.run.bind(null, bot));
            console.log(`Évènement ${file.slice(0, file.length - ".js".length)} chargé avec succès`);
        }
    );
}