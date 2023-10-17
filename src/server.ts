import { Request, Response } from "express";
import app from "./app";

async function main() {
  const PORT = 5000;
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: `Server is running on port: ${PORT}`,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

main();
