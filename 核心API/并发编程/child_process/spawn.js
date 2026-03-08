import { spawn } from "child_process";

// spawn(command: string, args: readonly string[], options: SpawnOptions): ChildProcess
// 派生一个子进程

// stdio : stdin,stdout,stderr指定为pipe ：
// options.stdio 选项用于配置在父进程和子进程之间建立的管道。
// 默认情况下，子进程的 stdin、stdout 和 stderr 会重定向到
// ChildProcess 对象上的相应 subprocess.stdin、subprocess.stdout 和 subprocess.stderr 流。
// 这等同于将 options.stdio 设置为 ['pipe', 'pipe', 'pipe']。

// 例1.
//   默认值  等同于
//   { stdio : "pipe" }  等同于
//   { stdio : ["pipe", "pipe", "pipe"] }

const child1 = spawn("ls", ["-lap"], {
  stdio: ["pipe", "pipe", "pipe"],
});

child1.stdin.on("data", (data) => {
  console.log(`subProcess.stdin : \n${data}`);
});
child1.stdout.on("data", (data) => {
  console.log("---------------------------------");
  console.log(`subProcess.stdout : \n${data}`);
});
child1.stderr.on("data", (data) => {
  console.log(`subProcess.stderr : \n${data}`);
});
// stdout :
// total 12
// drwxr-xr-x 2 gaofei gaofei 4096 Mar  8 16:42 ./
// drwxr-xr-x 4 gaofei gaofei 4096 Mar  8 00:24 ../
// -rw-r--r-- 1 gaofei gaofei  869 Mar  8 16:52 spawn.js

// 例2.
//   { stdio : "inherit" }  等同于
//   { stdio : ["inherit", "inherit", "inherit"] }  等同于
//   { stdio : [0, 1, 2] }
//   通过相应的 stdio 流传递到/来自父进程。
//   在前三个位置中，这分别相当于 process.stdin、process.stdout 和 process.stderr。
//   在其他位置，则相当于 'ignore'。

const child2 = spawn("ls", ["-lap"], {
  stdio: [0, 1, 2],
});

child2.on("close", (code, signal) => {
  console.log(`子进程执行完毕，状态码： ${code}`);
  process.exit(0);
});

// total 12
// drwxr-xr-x 2 gaofei gaofei 4096 Mar  8 16:42 ./
// drwxr-xr-x 4 gaofei gaofei 4096 Mar  8 00:24 ../
// -rw-r--r-- 1 gaofei gaofei 1865 Mar  8 17:16 spawn.js
// 子进程执行完毕，状态码： 0

// 例3.
// 将stdio指定为stream

const child3 = spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

// 例4.指定stdin,stdout,stderr以外的额外文件描述符，创建额外的管道  "ipc"
//  "ipc"
//   创建一个 IPC 通道，用于在父进程和子进程之间传递消息/文件描述符。
//   一个 ChildProcess 最多可以有一个 IPC stdio 文件描述符。
//   设置此选项将启用 subprocess.send() 方法。
//   如果子进程是一个 Node.js 实例，IPC 通道的存在将启用 process.send() 和 process.disconnect() 方法，
//   以及子进程中的 'disconnect' 和 'message' 事件。