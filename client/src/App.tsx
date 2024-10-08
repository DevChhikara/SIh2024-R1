import React, { Suspense, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { Router } from "@/router";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/hooks/useAuth";
import { ChakraProvider } from "@chakra-ui/react";
import { socket } from "./hooks/socket";

import "./stylesapp.css";
import "react-toastify/dist/ReactToastify.css";


export const App = () => {
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Socket.IO connected successfully!");
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <HashRouter>
      <AuthProvider>
        <ChakraProvider>
          <Suspense fallback="loading...">
            <Router />
          </Suspense>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            pauseOnHover
            closeButton
          />
        </ChakraProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
