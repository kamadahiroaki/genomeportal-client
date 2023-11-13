const http = require("http");
const url = require("url");

let clients = [];
let server = new http.Server();
server.listen(8080);

server.on("request", (request, response) => {
  let pathname = url.parse(request.url).pathname;

  if (request.method === "GET") {
    console.log("method: ", "GET");
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    });
    response.write("data: Connected\n\n");
    response.end();
  } else if (request.method === "POST") {
    console.log("method: POST");
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    let data = "";
    request
      .on("data", (chunk) => {
        data += chunk;
      })
      .on("end", () => {
        const params = JSON.parse(data);
        console.log(data);
        response.write(data);
        response.end();
      });
  } else {
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "",
    });
    response.write("data: else\n");
    response.end();

    console.log("else");
    console.log(request.method);
  }
});
