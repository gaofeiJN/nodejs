const http2 = require("http2");
const path = require("path");
const fs = require("fs");

const options = {
  key: fs.readFileSync(
    path.join("C:/Users/Administrator/.tsl", "localserver.key"),
  ),
  cert: fs.readFileSync(
    path.join("C:/Users/Administrator/.tsl", "localserver.crt"),
  ),
};

const server = http2.createSecureServer(options);

// 监听错误事件
server.on("error", (err) => console.error(err));

// 监听请求事件
server.on("stream", (stream, headers) => {
  // 发送响应头
  stream.respond({
    "content-type": "text/html",
    ":status": 200,
  });

  // 发送响应体
  stream.end("<h1>Hello HTTP/2!</h1>");
});

// 启动服务器
server.listen(8443, () => {
  console.log("HTTP/2 server is listening on https://localhost:8443");
});
