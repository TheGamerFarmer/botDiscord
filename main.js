const Discord = require ("discord.js");
const intents = new Discord.IntentsBitField(3276799);
const bot = new Discord.Client({intents});
const loadCommands = require ("./Loaders/loadCommandes");
const loadEvents = require ("./Loaders/loadEvents");
const config = require ("./config");

Discord.DefaultRestOptions.timeout = 30000;
bot.msg = require("./Fonctions/fonMessage");
bot.eph = require("./Fonctions/messageEphemere");
bot.commands = new Discord.Collection();
bot.color = "#FF0000";
bot.monID = 599150211373465601;
bot.function = {
    createID: require("./Fonctions/createID"),
    mute: require("./Fonctions/fonMute"),
    ban: require("./Fonctions/fonBan"),
    xpTotal: require("./Fonctions/xpTotal"),
    mp: require("./Fonctions/sendMp"),
    generateCaptcha: require("./Fonctions/generateCaptcha"),
    sendCaptcha: require("./Fonctions/sendCaptcha"),
    initialisationServeur: require("./Fonctions/fonInitialisationServeur"),
    isAdministrator: require("./Fonctions/isAdministrator"),
    securiser: require("./Fonctions/securiser"),
};

bot.login(config.token);
loadCommands(bot);
loadEvents(bot);