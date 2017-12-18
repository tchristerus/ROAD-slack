"use strict";
var io = require('socket.io')(6666);
var http = require('http');
var Router = require('node-simple-router');

var router = Router();
var callbacks = [];
console.log("Socket erver started at port 6666");
console.log("webserver started at port 1234");

router.post("/slack/end", function(request, response) {
    console.log(callbacks);
    callbacks.forEach(function(element) {
        if(element.team == request.post.team_id) {
            element.callback(request.post.event.text);
        }
    });
    response.end(request.post.challenge);
});

router.post("/github/end", function (request, response) {
    //var json = JSON.parse(request.post);
    //console.log(request.post.repository.url);
    callbacks.forEach(function(element) {
        if(element.githubURL == request.post.repository.url) {
            var commits = request.post.commits[0];
            console.log(request.post.commits);
            console.log("Message: " + commits.author.message);

            element.callback("commit by " + commits.author.name);
        }
    });
    response.code(200);
});

var server = http.createServer(router);

server.listen(1234);

io.on('connect', function (soc) {
    soc.on("init", function (msg) {
        var json = JSON.parse(msg);
        soc.teamID = json.teamID;
        soc.githubURL = json.githubURL;
        callbacks.push({team: json.teamID, socketId: soc.id, githubURL: soc.githubURL, callback: function(msg){
            soc.emit("message_received", msg);
        }});
    });

    soc.on("disconnect", function () {
        callbacks.forEach(function(element) {
            if(element.socketId == soc.id) {
                console.log("Removed socket: "  + soc.id);
            }
        });
    });
});

