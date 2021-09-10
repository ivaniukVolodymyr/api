// var mysql = require('mysql');

const mysql = require("mysql");
const databaseUrl = "sql11.freesqldatabase.com";

const connection = mysql.createConnection({
    host: databaseUrl,
    user: "sql11436082",
    port: "3306",
    database: "sql11436082",
    password: "dUWWrfdnEy"
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
