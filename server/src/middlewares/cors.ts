import { Request, Response, NextFunction } from "express";

type CORS = (req: Request, res: Response, next: NextFunction) => void;

const allowedHeaders = ["Authorization", "Content-Type", "sec-ch-ua", "sec-ch-ua-mobile", "sec-ch-ua-platform"];
const allowedOrigins = ["https://s-ih2024-r1-8uq7.vercel.app"];

const cors: CORS = (req, res, next) => {
  const origin = req.headers.origin;
  const method = req.method;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(", "));
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (method === "OPTIONS") {
      return res.status(200).end();
    } else {
      return next();
    }
  } else if (!origin) {
    return next();
  } else {
    return res.status(403).end();
  }
};

export default cors;
