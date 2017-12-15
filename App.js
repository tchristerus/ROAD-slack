"use strict";
var io = require('socket.io')(6666);
var http = require('http');
var Router = require('node-simple-router');

var router = Router(); // may also be router = new Router();
var callbacks = [];
console.log("Socket erver started at port 6666");
console.log("webserver started at port 1234");

router.post("/slack/end", function(request, response) {
    console.log(callbacks);
    callbacks.forEach(function(element) {
        if(element.team == request.post.team_id) {
            element.callback(request.post.event.text);
            console.log("found");
        }
    });
    response.end(request.post.challenge);
});

var server = http.createServer(router);

server.listen(1234);

io.on('connect', function (soc) {
    soc.on("init", function (msg) {
        soc.teamID = msg;
        callbacks.push({team: msg, callback: function(msg){
            soc.emit("message_received", msg);
        }});
    });
});

