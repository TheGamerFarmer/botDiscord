const Discord = require("discord.js");

module.exports = function (member){
    return member.permissions.has(Discord.PermissionsBitField.Flags.Administrator);
};