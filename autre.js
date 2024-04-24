let http = require('http');
let fileSystem = require('fs');
let server = http.createServer();
let url = require('url');
let query = require('querystring');
let mySql = require('mysql');
let events = require("events");
let myEvent = new events.EventEmitter();
let baseDeDonnee = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bdnodejs'
});

baseDeDonnee.connect(function (err) {
    server.on('request', function (req, res) {

        let parsedUrl = url.parse(req.url, true);
        let pathname = parsedUrl.pathname;

        if (pathname === '/page1.html' || pathname === '/page2.html') {
            fileSystem.readFile(__dirname + pathname, 'utf8', function (err, data) {
                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
            return;
        }

        if (pathname === '/ajax.html') {
            if (err) throw err;
            let sql = 'SELECT * FROM personne;';
            baseDeDonnee.query(sql, function (err, resultat) {
                if (err) throw err;
                let data = '';
                for (let i = 0; i < resultat.length; i++) {
                    data += '<label for="nom">' + resultat[i].nom + '</label><label for="prenom"> ' + resultat[i].prenom + '</label><br>'
                }
                res.end(data);
            });
            return;
        }


        if (pathname === '/index.html' || pathname === '/' || pathname === '/*') {

            fileSystem.readFile(__dirname + '/index.html', 'utf8', function (err, data) {
                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
            return
        }

        if (pathname === '/resultat.html') {

            if (req.method === 'POST') {
                let body = '';

                req.on('data', function (dataChunk) {
                    body += dataChunk;
                });

                req.on('end', function () {
                    let formData = query.parse(body);

                    fileSystem.readFile(__dirname + pathname, 'utf8', function (err, data) {
                        if (err) throw err;
                        data = data.replace('{{nom}}', formData.nom);
                        data = data.replace('{{prenom}}', formData.prenom);
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data);
                    });
                    return;

                });
            }
            if (req.method === 'GET') {
                console.log("test")
                let prenom = parsedUrl.query.prenom
                let nom = parsedUrl.query.nom

                fileSystem.readFile(__dirname + pathname, 'utf8', function (err, data) {
                    if (err) throw err;
                    data = data.replace('{{nom}}', nom);
                    data = data.replace('{{prenom}}', prenom);

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                });

                return;

            }
        }

        else {
            fileSystem.readFile(__dirname + '/erreur.html', 'utf8', function (err, data) {
                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
            return;
        }
    });
});

server.listen(8080);