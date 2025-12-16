import app from "./app";
import config from "./config";

app.listen(config.port, () => {
  console.log(`Server Is Running On Port ${config.port}`);
});
