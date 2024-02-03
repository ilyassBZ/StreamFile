// const fs = require("fs");
const File = require("../models/File.js");
const { Readable } = require("stream");
// const path = require("path");

const search = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required",
      });
    }
    const item_per_page = 30;
    let page = 1;
    // const skip = (page - 1) * item_per_page;

    // const result = File.find({
    //   data: {
    //     $elemMatch: {
    //       $regex: new RegExp(keyword, "i"),
    //     },
    //   },
    // })
    //   .skip(skip)
    //   .limit(item_per_page)
    //   .cursor();

    // const stream = result.cursor();

    res.setHeader("Content-disposition", "attachment; filename=file.txt");
    res.setHeader("Content-type", "text/plain");
    // stream.on("data", (entry) => {
    //   const data = `${entry.name}\n${JSON.stringify(entry.data)}\n\n`;
    //   res.write(data);
    // });
    //
    // stream.on("end", () => {
    //   res.end();
    // });
    //
    // stream.on("error", (error) => {
    //   console.error("Error during download:", error);
    //   res.status(500).end("Internal server error");
    // });
    // const sendNChunk = async () => {
    //   try {
    //     const skip = (page - 1) * item_per_page;
    //
    //     const result = await File.find({
    //       data: {
    //         $elemMatch: {
    //           $regex: new RegExp(keyword, "i"),
    //         },
    //       },
    //     })
    //       .skip(skip)
    //       .limit(item_per_page);
    //
    //     if (result.length > 0) {
    //       let data = "";
    //
    //       for (const entry of result) {
    //         data += `${entry.name}\n${JSON.stringify(entry.data)}\n\n`;
    //       }
    //
    //       res.write(data);
    //
    //       page++;
    //
    //       setImmediate(sendNChunk);
    //     } else {
    //       res.end();
    //     }
    //   } catch (error) {
    //     console.error("Error during download:", error);
    //     res.status(500).end("Internal server error");
    //   }
    // };
    //
    // setImmediate(sendNChunk);
    // const textData = result
    //   .map((entry) => `${entry.name}\n${JSON.stringify(entry.data)}\n\n`)
    //   .join("");
    //
    // const chunkSize = 16;
    // const readStream = Readable.from(textData, { highWaterMark: chunkSize });
    //
    // readStream.pipe(res);
    //
    // readStream.on("end", () => {
    //   console.log("File stream ended.");
    // });
    //
    // readStream.on("close", () => {
    //   console.log("File stream closed.");
    // });
    // readStream.on("error", (err) => {
    //   console.error(err);
    //   res.status(500).end("server err");
    // });
    const readStream = new Readable({
      objectMode: true,
      async read() {
        try {
          const skip = (page - 1) * item_per_page;

          const result = await File.find({
            data: {
              $elemMatch: {
                $regex: new RegExp(keyword, "i"),
              },
            },
          })
            .skip(skip)
            .limit(item_per_page);

          if (result.length > 0) {
            result.forEach((entry) => {
              this.push(`${entry.name}\n${JSON.stringify(entry.data)}\n\n`);
            });

            page++;
          } else {
            this.push(null);
          }
        } catch (error) {
          console.error(error);
          res.status(500).end(" server error");
        }
      },
    });
    readStream.pipe(res);
  } catch (error) {
    console.error("Error in search:", error);
    res.status(500).json({ error: " server error" });
  }
};

module.exports = { search };
