const express = require("express");
const multer = require("multer");
const connectDb = require("./db/db");
const http = require("http");
const socketIO = require("socket.io");
const { search } = require("./controllers/search");

const cors = require("cors");

const app = express();
const server = http.createServer(app);

const { handleForm } = require("./controllers/handleForm");

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});
// const io = socketIO(server, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

require("dotenv").config();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    msg: "hello world",
  });
});
app.post("/upload", upload.single("file"), (req, res) => {
  handleForm(req, res, io);
});

app.get("/search", search);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    connectDb(process.env.URI);
    server.listen(port, () => {
      console.log(`server is running on port:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
