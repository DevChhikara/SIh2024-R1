import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/database/config";
import router from "./src/routes";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const corsOptions = {
  origin: 'https://sih2024-r1-5.onrender.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(router);

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on('updateCellContent', (data) => {
    console.log(data.content);
    socket.broadcast.emit('cellContentUpdated', data);
  });
});

connect().then(() => {
  server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});
