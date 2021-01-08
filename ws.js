var websocket = require("ws").Server;
var { URLSearchParams } = require("url");
module.exports.startServer = (server) => {
  var ws = new websocket({ server: server, path: "/connect" });
  var users = {};
  var connectQ = {};
  ws.on("connection", (socket, req) => {
    var url = req.url;
    url = url.slice(url.indexOf("?"), url.length);
    var name = new URLSearchParams(url).get("name");
    users[name] = socket;
    if (connectQ[name]) {
      socket.send(JSON.stringify(connectQ[name]));
    }
    socket.on("message", (data) => {
      var pos = JSON.parse(data);
      if (users[pos.name]) {
        users[pos.name].send(JSON.stringify(pos));
      }
      if (!users[pos.name] && pos.pos == -1) {
        connectQ[pos.name] = pos;
      }
    });
    socket.on("close", () => {
      delete users[name];
    });
  });
};
