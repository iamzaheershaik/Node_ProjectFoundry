const http = require("http");
const fs = require("fs");
const Port = 8080;
const firstServer = http.createServer((req, res) => {
  let filePath = "";
  switch (req.url) {
    case "/":
      filePath = "./index.html";
      break;
    case "/about":
      filePath = "./about.html";
      break;
    case "/product":
      filePath = "./product.html";
      break;
    case "/contact":
      filePath = "./contact.html";
      break;
    default:
      filePath = "./404.html";
      break;
  }
  let result = fs.readFileSync(filePath, "utf8");
  res.end(result);
});
firstServer.listen(Port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Server is start at http://localhost:${Port}`);
});
