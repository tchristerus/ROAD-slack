var socket = io.connect('http://slack.christerus.com:6666');

socket.on('connect', function(){
    "use strict";
    socket.emit("init", 'T8D9X6BS6');

    socket.on("message_received", function (msg) {
        $("#received").html(msg);
    })
});