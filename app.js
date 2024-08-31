const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {
    // Listen for "send-location" events
    socket.on("send-location", function(data) {
        // Broadcast the location to all connected clients
        io.emit("receive-location", { id: socket.id, ...data });
    });

    // Listen for client disconnect
    socket.on("disconnect", function() {
        // Notify all clients that a user has disconnected
        io.emit("user-disconnected", socket.id);
    });
});

// Render the "index" view when the root URL is accessed
app.get("/", function (req, res) {
    res.render("index");
});

// Start the server on port 3000
server.listen(4000, function() {
    console.log("Server is running on port 4000");
});
