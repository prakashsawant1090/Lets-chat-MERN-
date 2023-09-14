const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./Config/db");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const chatRoutes = require("./routes/chatRoutes");

const app = express();
dotenv.config();
connectDB();

app.use(express.json()); //to accept json data

app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server started successfully on ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 600000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  //
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join Chat", (room) => {
    socket.join(room);
    console.log("user joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});
