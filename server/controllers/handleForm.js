const fs = require("fs");
const path = require("path");
const { dnsRes } = require("../services/dnsRes");
const handleForm = async (req, res, io) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file to upload",
      });
    }

    let fileProgress = 0;
    const uploadP = path.join(__dirname, `../upload/${file.originalname}`);
    const filesize = fs.statSync(uploadP).size;

    const chunkSize = 16;

    let lastLine = "";
    const fileSteam = fs.createReadStream(
      uploadP,
      {
        highWaterMark: chunkSize,
      },
      "utf-8",
    );
    fileSteam.on("data", (chunk) => {
      lastLine += chunk.toString("utf-8");

      fileProgress += 16;
      console.log((fileProgress / filesize) * 100);
      progress = (fileProgress / filesize) * 100;
      io.emit("progress", { progress });

      if (lastLine.endsWith("\n")) {
        const domain = lastLine.replace(/"/g, "").split(",")[1];
        procDmn(domain);
        lastLine = "";
      }
    });
    fileSteam.on("end", () => {
      if (lastLine) {
        const domain = lastLine.replace(/"/g, "").split(",")[1];
        procDmn(domain);
        fileProgress += chunk.length;
      }

      fs.unlink(uploadP, (err) => {
        setTimeout(() => {
          if (progress >= 100) {
            progress = 0;
            io.emit("progress", { progress });
          }
        }, 2000);

        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully.");
        }
      });
    });
    res.json({
      success: true,
      msg: "yoo its working",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

async function procDmn(domain) {
  try {
    await dnsRes(domain);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { handleForm };
