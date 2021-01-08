const { EventEmitter } = require("events");
var express = require("express");
var router = express.Router();
var users = [];
var updates = new EventEmitter();
router.get("/start", function (req, res, next) {
  var name = req.query.name;
  var length = users.push({ name }) - 1;
  if (length != 0) {
    res.json({ player: users[0].name });
    users.splice(length, 1);
    updates.emit("play", users[0].name, name);
  } else {
    updates.on("play", (user, player) => {
      users.splice(0, 1);
      if (user == name) {
        res.json({ player });
      }
    });
  }
});

module.exports = router;
