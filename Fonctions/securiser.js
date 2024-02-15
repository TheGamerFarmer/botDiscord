module.exports = function (txt) {
    ["\\", "'", "-", "_"].forEach(characters => txt = txt?.replaceAll(characters, `\\${characters}`));
    txt = txt?.replaceAll("§n", `\n`);
    return txt;
}