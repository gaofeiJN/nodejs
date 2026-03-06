// 浏览器中的事件循环

setTimeout(() => {
  console.log("setTimeout 0");
}, 0);

Promise.resolve().then(() => console.log("promise.then()"));

console.log("main");

// main
// promise.then()
// setTimeout 0

// nodejs的事件循环
