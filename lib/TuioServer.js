module.exports = (function() {
    var tuio_socket = require("ws").Server,
    tuio_handler = null,
    socketio = require("socket.io"),
    io = null,
    sock = null,
    oscParser = require("./OscParser"),

    init = function(params) {
	tuio_handler = new tuio_socket({port: 3333});
	tuio_handler.on("connection", onTUIOSocketConnection);

        io = socketio.listen(params.socketPort);
        io.enable("browser client minification");
        io.enable("browser client etag");
        io.enable("browser client gzip");
        io.set("log level", 1);
        io.set("transports", [
            "websocket",
            "flashsocket",
            "htmlfile",
            "xhr-polling",
            "jsonp-polling"
        ]);
        io.sockets.on("connection", onSocketConnection);
    },

    onSocketListening = function() {
	console.log("listening");
        var address = tuio_handler.address();
        console.log("TuioServer listening on: " + address.address + ":" + address.port);
    },

    onSocketConnection = function(socket) {
	sock = socket;
	console.log("message received");
        //tuio_handler.on("message", function incoming(msg) {
	//    console.log("sending received message to parser");
        //    socket.emit("osc", oscParser.decode(msg));
        //});
    },


    onTUIOSocketConnection = function connection(ws) {
                console.log("TUIO socket connected");
                ws.on("message", function(msg) {
			//console.log("sending message to parser");
                        sock.emit("osc", oscParser.decode(msg));
                });
    };

    /*},
	onTUIOSocketListening = function() {
                var address = tuio_handler.sockets.address();
                console.log("NEW TuioServer listening on: " + address.address + ":" + address.port);
        },

        onTUIOSocketConnection = function(socket) {
                console.log("TUIO message received");
                tuio_handler.sockets.on("message", function(msg) {
                        socket.emit("osc", oscParser.decode(msg));
                });
       };*/

    return {
        init: init
    };
}());
