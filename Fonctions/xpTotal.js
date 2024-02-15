module.exports = function (level, xp){
    let xpTotal = 0;

    for(let i = 0 ; i < level ; i++)
        xpTotal += (i + 1) * 1000;
    xpTotal += xp;
    
    return xpTotal;
}