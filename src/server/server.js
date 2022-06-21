const http = require("http");
const fs = require("fs");
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
//      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      "access-control-allow-origin": "http://localhost:3000",
      "Transfer-Encoding": "",
    });
    response.write("data: Connected\n\n");

    console.log("response.length: ", response.length);
    console.log("response.data: ", response.data);
    response.end();
//    acceptNewClient(request, response);
  } else {
//    broadcastNewMessage(request, response);
  }
});

function acceptNewClient(request, response) {
  clients.push(response);
  request.connection.on("end", () => {
    clients.splice(clients.indexOf(response), 1);
    response.end();
  });
  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  });
  response.write("event: chat\ndata: Connected\n\n");
}

async function broadcastNewMessage(request, response) {
  request.setEncoding("utf8");
  let body = "";
  for await (let chunk of request) {
    body += chunk;
  }
  response.writeHead(200).end();
  let message = "data: " + body.replace("\n", "\ndata: ");
  let event = `event: chat\n${message}\n\n`;
  clients.forEach((client) => client.write(event));
}
