import { io } from "socket.io-client";
const SOCKET_URL = "https://sih2024-r1-3.onrender.com";
export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
