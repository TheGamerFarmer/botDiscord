module.exports = function createID (prefix, length) {
    let caracters = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"];
    let id = [];

    for(let i = 0; i < length; i++)
        id.push(caracters[Math.floor(Math.random() * caracters.length)]);

    id = id.join("");

    if(prefix)
        return `${prefix}-${id}`;
    else
        return id;
}