const express = require('express');
const app = express();
const url = require("url");
const path = require('path');
const port = 8080;

let http = require('http');
let server = http.createServer();
let mySql = require('mysql');
let query = require('querystring');
let bdd = mySql.createConnection({
    host: 'localhost',
    user: 'lery',
    password: '',
    database: 'login'
});

app.use(express.static(path.join(__dirname, '/html')));
app.use(express.static(path.join(__dirname, '/css')));
app.use(express.urlencoded({ extended: true }));

/********************ROUTAGE STATIC*********************/
app.get('/APropos.html', function (req, res) {
    console.log("Page APropos");
    res.sendFile(__dirname + '/html/APropos.html');
})
/************FIN IMPACT ROUTAGE STATIC******************/

app.get('/index.html', function (req, res) {
    console.log("Page index");
    res.sendFile(__dirname + '/index.html');
});


app.get("/Annonces.html", function (req, res) {
    console.log("Page Annonces");
    let login = req.query.loginText;
    console.log(url.parse(req.url, true).pathname);
    console.log(login);
    res.sendFile(__dirname + '/Annonces.html');
});

server.on('request', function (req, res) {
    bdd.connect(function (err) {

        app.post('/session.html', function (req, res) {
            let login = req.query.loginText;
            console.log(login);

            let sql = 'SELECT COUNT(*) FROM login L WHERE L.login = "' + login + '";';

            bdd.query(sql, function (err, result) {
                if (err) {
                    console.log('Erreur ce login n\'est pas dans la bdd');
                    res.sendFile(__dirname + '/index.html');
                    throw err;
                    bdd.end();
                } else{
                    console.log('login présent dans la bdd');
                    res.sendFile(__dirname + '/Annonces.html');
                }//Gérer le cas ou c'est null
            console.log(result);
            bdd.end();
            });
        });

    });
});

app.listen(port, function (req, res) {
    console.log("start !");
});