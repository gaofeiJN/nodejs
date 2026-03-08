console.log("------------------------");
console.log("【child】子进程开始运行");

process.on("message", (data) => {
  // data中有回车换行符？？改成data.trim()之后能正常exit和error了
  switch (data.trim()) {
    case "error":
      throw new Error("【child】子进程发生错误");
    case "exit":
      console.log("------------------------");
      process.send("【child】收到父进程的终止消息，子进程马上关闭");
      process.exit(0);
    default:
      console.log("------------------------");
      console.log("【child】 recerves message", data);
      process.send(data);
      break;
  }
});
