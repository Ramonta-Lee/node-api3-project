// code away!
const server = require("./server.js");

const port = "http://localhost:4000";

server.listen(4000, () => {
  console.log(`\n* Server Running on ${port} *\n`);
});
