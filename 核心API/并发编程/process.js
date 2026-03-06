let env = process.env;
let argv = process.argv;
let version = process.version;
let platform = process.platform;

let obj = {};

let fun = async function () {
  await Promise.resolve().then(() => console.log("hello world"));

  // 未捕捉的错误
  bbb(); // 监测到未捕获的错误 ReferenceError: bbb is not defined
};

fun();

process.on("uncaughtException", (error) => {
  console.log("监测到未捕获的错误", error);
});

// 由于此时process上已经注册了uncaughtException的监听器，
// 因此可以捕捉到aaa未定义的错误
// aaa(); // 监测到未捕获的错误 ReferenceError: aaa is not defined
