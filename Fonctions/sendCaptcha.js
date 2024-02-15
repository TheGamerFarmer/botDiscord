const Discord = require("discord.js");
const ms = require("ms");

module.exports = async function (bot, member){
    const db = bot.db
    await bot.function.generateCaptcha(bot, member, function (captcha) {
        db.query(`SELECT * FROM captcha WHERE guildID = ${member.guild.id}`, async (err, dbCaptcha) => {
            if(!Boolean(dbCaptcha[0]?.isCaptcha)){
                if(dbCaptcha[0].roleID)
                    await member.roles.add(dbCaptcha[0].roleID);
                return;
            }

            member.user.globalName = bot.function.securiser(member.user.globalName);
            member.guild.name = bot.function.securiser(member.guild.name);

            const channel = member.guild.channels.cache.get(dbCaptcha[0].channelID);
            const msg = await channel.send({content: `${member}, vous avez ${dbCaptcha[0].timeCaptcha} pour compléter le captcha ! Si vous ne le réussissez pas , vous serez exclus du server !`,
                files: [new Discord.AttachmentBuilder((await captcha.captcha).toBuffer(), {name: "captcha.png"})]});

            await channel.permissionOverwrites.create(member.user, {
                SendMessages: true,
                ViewChannel: true,
                ReadMessageHistory: true,
            });

            try{
                const filter = m => m.author.id === member.user.id;
                
                let response = (await channel.awaitMessages({filter, max: 1, time: ms(dbCaptcha[0].timeCaptcha), errors: ["time"]})).first();

                if (response.content === captcha.text){
                    await msg.delete();
                    await response.delete();
                    bot.function.mp(bot, member.user, "Vous avez réussi le captcha !");
                    console.log(`L'utilisateur ${member.user.globalName} a rejoint le serveur ${member.guild.name} !`);
                    await channel.permissionOverwrites.delete(member.user);
                    if(dbCaptcha[0].roleID)
                        await member.roles.add(dbCaptcha[0].roleID);
                }
                else{
                    await msg.delete();
                    await response.delete();
                    await channel.permissionOverwrites.delete(member.user);

                    await bot.function.mp(bot, member.user, "Vous avez échouez le captcha !");
                    await member.kick("Captcha raté !");
                    console.log(`L'utilisateur ${member.user.globalName} a bien été kick par ${bot.user.username} pour cause de : captcha raté !`);
                };
            }
            catch(err){
                console.log(err);
                await msg.delete();
                await channel.permissionOverwrites.delete(member.user);

                await bot.function.mp(bot, member.user, "Vous avez mis trop de temps pour répondre au captcha !");
                await member.kick("Pas fait le captcha");
                console.log(`L'utilisateur ${member.user.globalName} a bien été kick par ${bot.user.username} pour cause de : pas fait le captcha`);
            }
        });
    });
}