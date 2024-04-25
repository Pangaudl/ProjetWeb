const express = require('express');
const app = express();
const url = require("url");
const path = require('path');
const port = 8080;
const fs = require('fs');

let mySql = require('mysql');
let query = require('querystring');
let bdd = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projetweb'
});
let sessions = require('express-session');
let data = '';
let cookieParser = require('cookie-parser');

// 2h en ms
const twoHours = 1000 * 60 * 60 * 2;

app.use(sessions({
    secret: "secretkeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: twoHours },
    resave: false
}));


app.use(express.static(path.join(__dirname, '/html')));
app.use(express.static(path.join(__dirname, '/css')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/********************ROUTAGE STATIC*********************/
app.get('/APropos.html', function (req, res) {
    console.log("Page APropos");
    res.sendFile(__dirname + '/html/APropos.html');
})
/************FIN IMPACT ROUTAGE STATIC******************/

app.get('/index.html', function (req, res) {
    console.log("Page index1");
    res.sendFile(__dirname + '/index.html');
});
app.get('/', function (req, res) {
    console.log("Page index2");
    res.sendFile(__dirname + '/index.html');
});

app.get("/Annonces.html", function (req, res) {
    console.log("Page Annonces");

    if (req.session.sessionLog !== undefined) {
        let login = req.session.sessionLog;
        console.log(login);

        fs.readFile(__dirname + '/Annonces.html', 'utf8', function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html charset=utf-8' });
                res.end('Fichier non trouvé!')
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html charset=utf-8' });
                data = data.replace('{{loginAnn}}', login);
                //console.log(data);
                res.end(data);
            }
            //res.sendFile(__dirname + '/Annonces.html');
        });
    } else {
        res.redirect('/index.html');
    }
});

app.get('/createCookie.html', function (req, res) {
    // Création de trois cookies
    res.cookie('nomCookie', 'valeurCookie3', {
        maxAge: 3600000,
        expires: new Date('01 122022'),
        secure: true,
        httpOnly: true,
        SameSite: true
    });
    console.log(req.cookies);
    res.send('Cookies created');
});


app.post('/session.html', function (req, res) {
    console.log("Route /session.html");
    let login = req.body.myLogin;
    //console.log(login);
    if (req.session.sessionLog === undefined) {
        let sql = 'SELECT COUNT(*) FROM login WHERE login = "' + login + '";';
        //console.log(sql);
        console.log(bdd.state);
        if (bdd.state == 'disconnected') {
            bdd.connect(function (err) {
                if (err) throw err;
                console.log("Connecté a la bdd!");
                //console.log(bdd.state);
                bdd.query(sql, function (err, result) {
                    //console.log(result[0]);
                    if (err || login == "" || result[0]["COUNT(*)"] === 0) {
                        console.log('Erreur ce login n\'est pas dans la bdd');
                        res.send('/index.html');
                    } else {
                        console.log('login présent dans la bdd');
                        //console.log(url.parse(req.url, true).pathname);
                        req.session.sessionLog = login;
                        //console.log(req.session);
                        console.log(data);
                        res.send('/Annonces.html');
                    }
                    bdd.end;
                    console.log("Déconnecté");
                });
            });
        } else {
            console.log("Déjà connecté a la bdd!");
            bdd.query(sql, function (err, result) {
                if (err || login == "" || result[0]["COUNT(*)"] === 0) {
                    console.log('Erreur ce login n\'est pas dans la bdd');
                    res.send('/index.html');
                } else {
                    console.log('login présent dans la bdd');
                    //console.log(url.parse(req.url, true).pathname);
                    req.session.sessionLog = login;
                    //console.log(req.session);
                    res.send('/Annonces.html');
                }
                bdd.end;
                console.log("Déconnecté");
            });
        }

    } else {
        res.send('/index.html');
    }
});

app.get('/nosession.html', function (req, res) {
    console.log(req.session);
    if (req.session.sessionLog != undefined) {
        req.session.destroy();
        console.log("Destruction de la session!");
        console.log(req.session);
        res.redirect('/index.html');
    } else {
        res.redirect('/index.html');
    }
});

app.listen(port, function (req, res) {
    console.log("start !");
});