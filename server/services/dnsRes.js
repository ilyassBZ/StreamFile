const axios = require("axios");
const File = require("../models/File.js");
const dnsRes = async (domain) => {
  const res = await axios.get(
    `https://dns.google/resolve?name=${domain}&type=TXT`,
  );
  const data = [];
  data.push(
    ...res.data.Answer.map((answer) => {
      return answer.data;
    }),
  );
  const domn = new File({ name: domain, data });
  await domn.save();
};

module.exports = { dnsRes };
