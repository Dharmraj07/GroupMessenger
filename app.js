const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const usersGroup = require("./routes/groupRoutes");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messageRoutes");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.use("/", userRoutes);
app.use("/", usersGroup);
app.use("/", messageRoutes);
// app.use("/chatroom.js", (req, res, next) => {
//   res.setHeader("Content-Type", "text/javascript");
//   next();
// });
app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(8000, () => {
  console.log("Server listening on port 8000");
});

const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("joinRoom", (data) => {
    const { username, group_id } = data;
    socket.join(group_id);
    console.log(`${username} joined room: ${group_id}`);
    io.to(group_id).emit("join", `${username} joined room`);
  });

  socket.on("message", (data) => {
    const { username, group_id, message } = data;
    console.log(`Message from ${username} in room ${group_id}: ${message}`);
    io.to(group_id).emit("message", { username, message, group_id });
  });

  socket.on("file", (data) => {
    const { username, group_id, filename } = data;
    console.log(`File received from ${username} in room ${group_id}: ${filename}`);
    io.to(group_id).emit("file", { username, filename, group_id });
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

// Handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
  const filename = req.file.filename;
  res.json({ filename });
});

// const express = require("express");
// const socketIO = require("socket.io");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const usersGroup = require("./routes/groupRoutes");
// const userRoutes = require("./routes/users");
// const messageRoutes = require("./routes/messageRoutes");
// const app = express();
// const path = require("path");

// app.use(cors());

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// //app.use(express.static(path.join(__dirname, "public")));

// app.use("/", userRoutes);
// app.use("/", usersGroup);
// app.use("/", messageRoutes);
// app.use(express.static(path.join(__dirname, "public")));

// const server = app.listen(8000, () => {
//   console.log("Server listening on port 8000");
// });

// const io = socketIO(server, {
//   cors: {
//     origin: "*",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A client connected");
//   // socket.emit('new-user','a')

//   socket.on("joinRoom", (data) => {
//     const { username, group_id } = data;
//     socket.join(group_id);
//     console.log(`${username} joined room: ${group_id}`);
//     // socket.on('new-user',`${username} joined room: ${roomId}`)
//     io.to(group_id).emit("join", `${username} joined room`);
//   });

//   socket.on("message", (data) => {
//     const { username, group_id, message } = data;
//     console.log(`Message from ${username} in room ${group_id}: ${message}`);
//     io.to(group_id).emit("message", { username, message, group_id });
//   });

//   socket.on("disconnect", () => {
//     console.log("A client disconnected");
//   });
// });
