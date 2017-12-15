var socket = io.connect('http://localhost:9473');
var userId = 1;


socket.on('connect', function(){
    "use strict";
    socket.emit("initialize_id", '{"slackUserId": "U12321"}');
});

socket.on("error_thrown", function (msg) {
    try {
        console.error(JSON.parse(msg));
    }catch (e){
        console.error("Failed to parse JSON" + msg + "Error: " + e);
    }
});

socket.on("response_message", function (msg) {
    try {
        console.info(JSON.parse(msg));
    }catch (e){
        console.info("Failed to parse JSON" + msg + "Error: " + e);
    }
});

function runPython() {
    socket.emit("learn_github_commit",  '{"commitMessage": "Fixed stuff"}');
}