import { app } from "./app.js";
const port = process.env.PORT || 9090;
const hostname = '0.0.0.0';


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});;
