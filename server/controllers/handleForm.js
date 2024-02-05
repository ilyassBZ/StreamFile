const fs = require("fs");
const path = require("path");
const { dnsRes } = require("../services/dnsRes");
const handleForm = async (req, res, io) => {
  let fileProgress = 0;
  try {
    const { buffer, originalname } = req.file;
    const uploadP = path.join(__dirname, `../upload/${originalname}`);
    const chunkSize = 1024;
    const writeStream = fs.createWriteStream(uploadP, { flags: "a" });

    let line = "";
    const promises = [];
    //
    // for (let i = 0; i < buffer.length; i += chunkSize) {
    //   const chunk = buffer.slice(i, i + chunkSize);
    //   const currentChunk = line + chunk.toString("utf-8");
    //   line = "";
    //
    //   const lines = currentChunk.split("\n");
    //   if (i < buffer.length - chunkSize) {
    //     line = lines.pop();
    //   }
    //
    //   promises.push(processChunk(lines, req, io));
    //
    //   fileProgress += chunkSize / req.file.size;
    //   const progress = parseInt((fileProgress / req.file.size) * 100);
    //   io.emit("progress", { progress });
    //
    //   writeStream.write(chunk);
    // }
    //
    // await Promise.all(promises);
    //
    // writeStream.end(() => {
    //   console.log("Stream finished.");
    //   clean(uploadP, io);
    //   res
    //     .status(200)
    //     .json({ success: true, msg: "File received successfully" });
    // });
    for (let i = 0; i < buffer.length; i += chunkSize) {
      const chunk = buffer.slice(i, i + chunkSize);
      const currentChunk = line + chunk.toString("utf-8");
      line = "";

      // const lines = currentChunk.split("\n");
      if (i < buffer.length - chunkSize) {
        line = currentChunk.split("\n").pop();
      }
      for (const currentLine of currentChunk.split("\n")) {
        if (currentLine) {
          const values = currentLine.split(",");
          if (values.length === 3) {
            const domain = values[1].replace(/"/g, "");
            console.log("domain:", domain);

            try {
              await procDmn(domain);
            } catch (error) {
              console.log("Error processing domain:", error);
            }
          } else {
            console.log("Invalid line format:", currentLine);
          }
        }
      }

      fileProgress += chunkSize / req.file.size;
      const progress = parseInt((fileProgress / req.file.size) * 100);
      io.emit("progress", { progress });

      writeStream.write(chunk);
    }

    writeStream.end(() => {
      console.log("Stream finished.");
      clean(uploadP, io);
      res
        .status(200)
        .json({ success: true, msg: "File received successfully" });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

// async function processChunk(lines, req, io) {
//   const chunkPromises = [];
//
//   for (const currentLine of lines) {
//     if (currentLine) {
//       const values = currentLine.split(",");
//       if (values.length === 3) {
//         const domain = values[1].replace(/"/g, "");
//         console.log("domain:", domain);
//
//         chunkPromises.push(
//           procDmn(domain).catch((error) => {
//             console.error("Error processing domain:", error);
//           }),
//         );
//       } else {
//         console.log("Invalid line format:", currentLine);
//       }
//     }
//   }
//
//   await Promise.all(chunkPromises);
// }
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
    await dnsRes(domain);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { handleForm };
