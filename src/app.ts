import express from "express";
import cors from "cors";
import httpStatus from "http-status";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//routes
app.use("/api/v1");

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Route Not Found",
    errorMessage: [
      {
        path: req.originalUrl,
        message: "Route Not Found",
      },
    ],
  });
});
export default app;
