const canvas = require("canvas");

module.exports = async function(bot, member, suite) {
    bot.db.query(`SELECT longueurCaptcha FROM captcha WHERE guildID = ${member.guild.id}`, async function (err, dbCaptcha){
        let text = await bot.function.createID("", dbCaptcha[0].longueurCaptcha);
        
        const captcha = canvas.createCanvas(300, 150);
        const ctx = captcha.getContext("2d");
        
        ctx.font = '35px "Arial"';
        ctx.fillStyle = bot.color;
        ctx.fillText(text, (150 - (ctx.measureText(text).width) / 2), 85);
        
        return suite({captcha: captcha, text: text});
    });
};