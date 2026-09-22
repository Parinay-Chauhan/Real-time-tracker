require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");

const http = require("http");
const socketio = require("socket.io");
const { disconnect } = require("cluster");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");

// Static files (CSS/JS/Images) ke liye app.use aur sahi spelling 'public'
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  socket.on("send-location", function (data) {
    io.emit("receive-locatoin", { id: socket.id, ...data });
  });
  
  socket.on("disconnect", function(){
    io.emit("user-disconnect", socket.id);
  })

});

app.get("/", function (req, res) {
  // views/index.ejs file ko render karne ke liye:
  res.render("index");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
