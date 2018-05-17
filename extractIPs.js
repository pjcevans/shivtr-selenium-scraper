var fs = require('fs');
var IPs = require("./array.js");
var ips = [];


IPs.IPArray.forEach((entry) => {
  if(ips.indexOf(entry.ip) === -1) { // collect list of unique ips
    ips.push(entry.ip)
  }
});

ips.forEach((ip) => {
  let players = [];
  IPs.IPArray.forEach((entry) => {
    if(ip === entry.ip && players.indexOf(entry.player) === -1) {
      players.push(entry.player)
    }
  });
  console.log(ip + " - " + players)
});
