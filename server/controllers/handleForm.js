const fs = require("fs");
const path = require("path");
const { dnsRes } = require("../services/dnsRes");
const handleForm = async (req, res, io) => {
  try {
    // const file = req.file;
    // if (!file) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "No file to upload",
    //   });
    // }

    const { buffer, originalname } = req.file;
    const uploadP = path.join(__dirname, `../upload/${originalname}`);

    const writeStream = fs.createWriteStream(uploadP, { flags: "a" });

    let fileProgress = 0;
    let line = "";

    for (let i = 0; i < buffer.length; i += 16) {
      const chunk = buffer.slice(i, i + 16);
      writeStream.write(chunk);
      line += chunk.toString("utf-8");

      while (line.includes("\n")) {
        const [currentLine, remainingLines] = line.split("\n", 2);

        const values = currentLine.trim().split(",");
        if (values.length === 3) {
          const domain = values[1].replace(/"/g, "");
          console.log("domain:", domain);

          try {
            await procDmn(domain);
          } catch (error) {
            console.error("Error processing domain:", error);
          }
        } else {
          console.warn("Invalid line format:", currentLine);
        }

        line = remainingLines;
      }

      fileProgress += 16;
      const progress = (fileProgress / buffer.length) * 100;
      io.emit("progress", { progress });
    }

    if (line.trim()) {
      console.log(" last line:", line);
    }

    writeStream.end(() => {
      console.log("Stream finished.");
      clean(uploadP, io);
      res
        .status(200)
        .json({ success: true, msg: "File received successfully" });
    });
    // const fileSteam = fs.createReadStream(
    //   uploadP,
    //   {
    //     highWaterMark: chunkSize,
    //   },
    //   "utf-8",
    // );
    // fileSteam.on("data", (chunk) => {
    //   lastLine += chunk.toString("utf-8");
    //
    //   fileProgress += 16;
    //   console.log((fileProgress / filesize) * 100);
    //   progress = (fileProgress / filesize) * 100;
    //   io.emit("progress", { progress });
    //
    //   if (lastLine.endsWith("\n")) {
    //     const domain = lastLine.replace(/"/g, "").split(",")[1];
    //     procDmn(domain);
    //     lastLine = "";
    //   }
    // });
    // fileSteam.on("end", () => {
    //   if (lastLine) {
    //     const domain = lastLine.replace(/"/g, "").split(",")[1];
    //     procDmn(domain);
    //     fileProgress += chunk.length;
    //   }
    //
    //   fs.unlink(uploadP, (err) => {
    //     setTimeout(() => {
    //       if (progress >= 100) {
    //         progress = 0;
    //         io.emit("progress", { progress });
    //       }
    //     }, 2000);
    //
    //     if (err) {
    //       console.error("Error deleting file:", err);
    //     } else {
    //       console.log("File deleted successfully.");
    //     }
    //   });
    // });
    // writeStream.write(buffer);
    // writeStream.end();
    // writeStream.on("finish", (chunk) => {
    //   console.log(chunk);
    //   const filesize = fs.statSync(uploadP).size;
    //
    //   let lastLine = "";
    //   const fileSteam = fs.createReadStream(
    //     uploadP,
    //     {
    //       highWaterMark: chunkSize,
    //     },
    //     "utf-8",
    //   );
    //
    //   let fileProgress = 0;
    //   fileSteam.on("data", (chunk) => {
    //     lastLine += chunk.toString("utf-8");
    //
    //     fileProgress += 16;
    //     console.log((fileProgress / filesize) * 100);
    //     progress = (fileProgress / filesize) * 100;
    //     io.emit("progress", { progress });
    //
    //     if (lastLine.endsWith("\n")) {
    //       const domain = lastLine.replace(/"/g, "").split(",")[1];
    //       procDmn(domain);
    //       lastLine = "";
    //     }
    //     fileSteam.on("end", () => {
    //       console.log("File stream ended.");
    //     });
    //   });
    // });
    // writeStream.end(clean(uploadP, io));
    // writeStream.end(() => {
    //   fs.unlink(uploadP, (err) => {
    //     setTimeout(() => {
    //       if (progress >= 100) {
    //         progress = 0;
    //         io.emit("progress", { progress });
    //       }
    //     }, 2000);
    //
    //     if (err) {
    //       console.error("Error deleting file:", err);
    //     } else {
    //       console.log("File deleted successfully.");
    //     }
    //   });
    //
    //   console.log("Stream finished.");
    //   res.status(200).send("File received successfully.");
    // });
    // res.json({
    //   success: true,
    //   msg: "yoo its working",
    // });
  } catch (error) {
    res.status(500).json(error);
  }
};
const clean = (filePath, io) => {
  fs.unlink(filePath, (err) => {
    setTimeout(() => {
      progress = 0;
      io.emit("progress", { progress });
    }, 2000);

    if (err) {
      console.error(" err");
    } else {
      console.log("done");
    }
  });
};
async function procDmn(domain) {
  try {
    // console.log(domain);
    await dnsRes(domain);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { handleForm };
