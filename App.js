"use strict";
var io = require('socket.io')(6666);
var http = require('http');
var Router = require('node-simple-router');

const machineLearningGithub = "machine_learning/github/";
var router = Router(); // may also be router = new Router();
var callbacks = [];
console.log("Socket erver started at port 6666");
console.log("webserver started at port 1234");

router.post("/slack/end", function(request, response) {
    // sockets[0].emit("message_received", request.post.event.text);
    callbacks.forEach(function(element) {
        if(element.userID == request.post.team_id) {
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



// /***
//  * @event Gets called a new users connects to the websocket server.
//  * @param socket connection
//  */
// io.on('connect', function (soc) {
//     /***
//      * @event Gets called whenever the c# app requires an github prediction.
//      * @param JSON. Example: { "slackUserId": "U123456" }
//      */
//     soc.on('initialize_id', function (msg) {
//         try {
//             var json = JSON.parse(msg); // converting incoming message to JSON
//             soc.join(json["slackUserId"]); // moving user to his own group
//             soc.slackId = json["slackUserId"]; // setting the socket slackID variable so we can use it anywhere later on
//             soc.machineLearningGithubPath = machineLearningGithub + soc.slackId + "/thingy.model"; // setting model path
//             soc.initialized = initializeUserFolder(soc); // Setting the client to ready. Used to deny other requests (if initialized correctly)
//             sendResponse(soc, "initialize_id", "success") // telling client that the initialisation process was successful.
//         }catch(e){
//             throwError(soc, "initialize_id", e); // sending error on fail (with message)
//             console.log(e); // showing error
//         }
//     });
//
//
//     /***
//      * @event Gets called whenever the c# app requires an github prediction.
//      * @param JSON. Example: { "commitMessage": "Removed 200 lines of code to fix index.php" }
//      */
//     soc.on("learn_github_commit", function (msg) {
//         if(soc.initialized){ // checking if the user is initialised already
//             var json = JSON.parse(msg); // parsing incoming message to JSON
//             if(json["commitMessage"].length > 0){ // checking if commit message is not empty
//                 PythonShell.run('test.py', function (err, results) { // calling python script (deep learning script)
//                     if (err) // checking if the python script did throw any error message.
//                         throwError(soc, "learn_github_commit", "Python thow an error: " + err); // send error to client
//                     else sendResponse(soc, "learn_github_commit", results[0]) // sending the result from the python script
//                 });
//             }else throwError(soc, "learn_github_commit", "Commit message is empty")
//         }else throwError(soc, "learn_github_commit", "User " + soc.id + " is not initialized yet, send event: initialize_id first")
//     });
// });
//
// function throwError(soc, event, msg){
//     log.error(msg);
//     soc.emit("error_thrown", JSON.stringify({event: event, message: msg}));
// }
//
// function sendResponse(soc, event, msg){
//     soc.emit("response_message", JSON.stringify({event: event, message: msg}));
// }
// //
//
// function initializeUserFolder(soc){
//     try {
//         if (!fs.existsSync(machineLearningGithub + soc.slackId)) {
//             fs.mkdirSync(machineLearningGithub + soc.slackId);
//             fs.mkdirSync(machineLearningGithub + soc.slackId + "/1");
//             fs.mkdirSync(machineLearningGithub + soc.slackId + "/2");
//             fs.mkdirSync(machineLearningGithub + soc.slackId + "/3");
//             fs.mkdirSync(machineLearningGithub + soc.slackId + "/4");
//             fs.mkdirSync(machineLearningGithub + soc.slackId + "/5");
//             fs.mkdirSync(machineLearningGithub + soc.slackId + "/predict");
//             fs.createReadStream(machineLearningGithub + "default_data/default.model").pipe(fs.createWriteStream(soc.machineLearningGithubPath));
//         }
//         return true;
//     }catch(e){
//         throwError(soc, "initializing_user", "Failed to create user folders");
//         return false;
//     }
// }
//
//
//
