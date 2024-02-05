const axios = require("axios");
const File = require("../models/File.js");
const dnsRes = async (domain) => {
  console.log(domain);
  const res = await axios.get(
    `https://dns.google/resolve?name=${domain}&type=TXT`,
  );
  console.log(`https://dns.google/resolve?name=${domain}&type=TXT`);
  const data = [];
  if (res.data.Answer) {
    console.log(res.data.Answer);
    data.push(
      ...res.data.Answer.map((answer) => {
        return answer.data;
      }),
    );
    const domn = new File({ name: domain, data });
    await domn.save();
  } else {
    // console.error(res.data);
  }
};

module.exports = { dnsRes };
