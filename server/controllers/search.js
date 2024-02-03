const fs = require("fs");
const File = require("../models/File.js");
const { Readable } = require("stream");
const path = require("path");

const search = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required",
      });
    }

    const result = await File.find({
      data: {
        $elemMatch: {
          $regex: new RegExp(keyword, "i"),
        },
      },
    });
    // const filePath = "search_results.txt";
    //
    // const pat = path.join(__dirname, `../${filePath}`);
    // const fileStream = fs.createWriteStream(filePath);
    //
    // result.forEach((result) => {
    //   fileStream.write(`${result.name}\n${JSON.stringify(result.data)}\n\n`);
    // });
    //
    // fileStream.end();
    //
    // fileStream.on("finish", () => {
    //   const readStream = fs.createReadStream(pat);
    //   res.setHeader(
    //     "Content-disposition",
    //     `attachment; filename=search_results.txt`,
    //   );
    //   res.setHeader("Content-type", "text/html");
    //   readStream.pipe(res);
    //
    //   readStream.on("close", () => {
    //     console.log("File stream closed.");
    //     // fs.unlink(filePath, (err) => {
    //     //   if (err) {
    //     //     console.error("Error deleting file:", err);
    //     //   } else {
    //     //     console.log("File deleted successfully.");
    //     //   }
    //     // });
    //   });
    // });

    //trying to  make this even fast iim gona stream the res derectly to the user without making file in the system

    const textData = result
      .map((entry) => `${entry.name}\n${JSON.stringify(entry.data)}\n\n`)
      .join("");

    res.setHeader("Content-disposition", "attachment; filename=file.txt");
    res.setHeader("Content-type", "text/plain");
    const chunkSize = 16;
    const readStream = Readable.from(textData, { highWaterMark: chunkSize });

    readStream.pipe(res);

    readStream.on("end", () => {
      console.log("File stream ended.");
    });

    readStream.on("close", () => {
      console.log("File stream closed.");
    });
    readStream.on("error", (err) => {
      console.error(err);
      res.status(500).end("server err");
    });
  } catch (error) {
    console.error("Error in search:", error);
    res.status(500).json({ error: " server error" });
  }
};

module.exports = { search };
