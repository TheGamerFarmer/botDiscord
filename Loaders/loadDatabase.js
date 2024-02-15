const mysql = require("mysql");
const config = require("../config");

const db = mysql.createConnection(config.dbinfo);

function getDb() {
    return db;
}

async function connection(fun) {
    db.connect(fun);
}

async function connectAndTry() {
    await connection(function (err) {
        if (err) {
            console.error(err);
            throw new Error ("La base de donnée n'est pas connectée");
        }
        console.log("Base de donnée connectée");
    });
}

module.exports = {getDb, connection, connectAndTry};