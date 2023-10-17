import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/global-error";
import { AppRouter } from "./routes";
import responseData from "./shared/response";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//router
app.use("/api/v1", AppRouter);

//global error handler
app.use(globalErrorHandler);

app.get("/", (req, res) => {
  return res.status(httpStatus.OK).json({
    success: true,
    message: `Lorry Lagbe app is running`,
  });
});

//route not found
app.use((req: Request, res: Response, next: NextFunction) => {
  return responseData(
    {
      statusCode: httpStatus.NOT_FOUND,
      status: false,
      message: "API end-point not found",
    },
    res
  );
});

export default app;
