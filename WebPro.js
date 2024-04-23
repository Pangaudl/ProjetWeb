const express = require('express');
const app = express();
const url = require("url");
const path = require('path');
const port = 8080;

app.use(express.static(path.join(__dirname,'/html')));
app.use(express.static(path.join(__dirname,'/css')));
//app.use(express.urlencoded({extended: true}));

/********************ROUTAGE STATIC*********************/
app.get('/index.html', function(req, res){
    console.log("Page index");
    res.sendFile(__dirname + '/html/index.html');
});

app.get('/APropos.html', function(req, res){
    console.log("Page APropos");
    res.sendFile(__dirname + '/html/APropos.html');
})

app.get("/Annonces.html",function(req, res){
    console.log("Page Annonces");
    let login = req.query.login;
    console.log(url.parse(req.url, true) .pathname);
    console.log(login);
    res.sendFile(__dirname + '/html/Annonces.html');
});
/************FIN IMPACT ROUTAGE STATIC******************/
app.listen(port, function(req, res){
    console.log("start !");
});