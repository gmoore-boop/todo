const http = require("http");
const server = http.createServer((req, res) => {

  console.log(req.__proto__);
  res.end("Check terminal");
})
server.listen(3001, () => {
  console.log("Server running on port 3000");
});