// const axios = require("axios");
const File = require("../models/File.js");
const dns = require("dns");
// const dnsPacket = require("dns-packet");
const dnsRes = (domain) => {
  console.log(domain);
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
  dns.resolveTxt(domain, (err, records) => {
    console.log(records);
    if (err) {
      return;
    }
    const data = records.map((record) => record.join(""));

    if (data.length > 0) {
      const domn = new File({ name: domain, data });
      domn.save().then(() => console.log("Data saved to MongoDB."));
    } else {
      console.error("No TXT records found for domain:", domain);
    }
  });
};

module.exports = { dnsRes };
