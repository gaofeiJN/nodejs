import { spawn } from "child_process";
import { error } from "console";

const child = spawn("node", ["spawn_child.js"], {
  stdio: [0, 1, 2, "ipc"],
  killSignal: "SIGTERM",

  // 通过 execArgv 让子进程在 9230 端口启动调试
  execArgv: ["--inspect=9230"],
});

// 监听事件
child.on("spawn", () => {
  console.log("------------------------");
  console.log("【parent】子进程成功生成");
});

child.on("message", (data) => {
  console.log("------------------------");
  console.log("【parent】收到来自子进程的消息", data);
});

// 'disconnect' 事件在父进程调用 subprocess.disconnect() 方法或子进程调用 process.disconnect() 方法后触发。
// 断开连接后，将无法再发送或接收消息，并且 subprocess.connected 属性为 false。
child.on("disconnect", () => {
  console.log("------------------------");
  console.log("【parent】与子进程的IPC通信已断开");
});

child.on("error", (error) => {
  console.log("------------------------");
  console.log("【parent】子进程发生错误", error);
});

// 'exit' 事件在子进程结束后触发。
// 如果进程正常退出，code 表示进程的最终退出代码，否则为 null。
// 如果进程因为收到信号而终止，signal 是该信号的字符串名称，否则为 null。
// 二者中总有一个不为 null。
child.on("exit", (code, signal) => {
  if (code !== null) {
    console.log(`【parent】child process exited with code ${code}`);
  } else {
    console.log(`【parent】child process exited with signal ${signal}`);
  }
});

// 'close' 事件在进程结束并且子进程的 stdio 流已经关闭后触发。
// 这与 'exit' 事件不同，因为多个进程可能共享相同的 stdio 流。
// 'close' 事件总是在 'exit' 已经触发之后，或者在子进程未能启动时触发 'error' 之后发出。
child.on("close", (code) => {
  console.log(`【parent】child process close all stdio with code ${code}`);
});

process.stdin.on("data", (data) => {
  const msg = data.toString().trim();

  if (msg === "SIGTERM") {
    child.kill(msg);
  } else {
    child.send(msg);
  }
});
