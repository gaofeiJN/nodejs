const cluster = require("cluster");
const http = require("http");
const os = require("os");

// 父进程根据cpu的数量创建子进程
if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
    console.log("fork a new child process");
  }
}
// 在每个子进程中创建一个http服务器，所有进程共享一个端口
else {
  const server = http.createServer((req, res) => {
    res.end("hello world! this is a childe process");
  });

  server.listen(8000, () => {
    "server starts listnening on 8000";
  });
}
