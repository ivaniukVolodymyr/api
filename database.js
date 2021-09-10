// var mysql = require('mysql');

const mysql = require("mysql");
const databaseUrl = "localhost";

const connection = mysql.createConnection({
    host: databaseUrl,
    user: "root",
    port: "3306",
    database: "data",
    password: "120687"
});
connection.connect(function (err) {
    if (err) {
        return console.error("Error message: " + err.message);
    }
    else {
        console.log("Successfully connected to database " + databaseUrl);
    }
});

module.exports = connection;
