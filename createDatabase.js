const fs = require('fs');
const db = require('./Loaders/loadDatabase').getDb();
const config = require("./config");

let sql = fs.readFileSync("createDatabase.sql");

db.connect(async err => {
    db.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = '${config.dbinfo.database}'`, (err, tables) => {
        tables.forEach(table => {db.query(`DROP TABLE ${table.table_name}`)});

        sql.toString()
            .split(';')
            .forEach(ligne => {
		ligne = ligne.trim();
                if(ligne)
                    db.query(ligne);
            });
        db.end();
        console.log("La base de donnée a bien été créée");
    });
});
