const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const indexRouter = require('./routes/index');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

const randomSecret = crypto.randomBytes(64).toString('hex');

app.use(
  session({
    secret: randomSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 Stunde
      secure: false,
    },
  })
);

// WebSocket
const WebSocket = require('ws');
const https = require('https');
const fs = require('fs-extra')
const server = https.createServer({
});
const wss = new WebSocket.Server({ server });
const sendLatestDataToWebSocketClients = require('./controller/sendLatestDataToWebSocket');



// WebSocket-Verbindungs-Handler
wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
});

wss.on('error', (error) => {
  console.error('WebSocket Server Error:', error);
});

setInterval(() => {
  sendLatestDataToWebSocketClients(wss);
}, 1000);

server.listen('1234','0.0.0.0',() => {
  console.log('Server is running on port 1234');
});

// Serve bundle.js using static middleware
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// Serve createTemperatureChart.js using static middleware
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/node_modules/chart.js/dist/chart.umd.js', function(req, res){
  res.sendFile(path.join(__dirname,'/node_modules/chart.js/dist/chart.umd.js'));
});

app.get('/node_modules/bootstrap/dist/css/bootstrap.css', function(req, res){
  res.sendFile(path.join(__dirname,'/node_modules/bootstrap/dist/css/bootstrap.css'));
});

app.get('/node_modules/bootstrap/dist/js/bootstrap.js', function(req, res){
  res.sendFile(path.join(__dirname,'/node_modules/bootstrap/dist/js/bootstrap.js'));
});

app.get('/controller/savePW.js', function(req, res) {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, 'controller', 'savePW.js'));
});

app.use('/', indexRouter);

app.listen(3000);
