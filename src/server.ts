import app from "./app";
import config from "./config";

async function main() {
  app.listen(config.PORT, () => {
    console.log(`Server is running on port: ${config.PORT}`);
  });
}

main();
