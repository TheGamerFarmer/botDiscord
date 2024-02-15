const fs = require('fs');
const db = require('./Loaders/loadDatabase').getDb();

let sql = fs.readFileSync("updateDatabase.sql");

db.connect(async err => {
    sql.toString()
        .split(';')
        .forEach(async q => {
            if(q) {
                db.query(q);
            }
        });
    db.end();
    console.log("La base de donnée a bien été mise à jour");
    });
