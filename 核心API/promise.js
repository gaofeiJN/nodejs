// 一个promise代表了一次异步操作，其落定是异步完成的

// Promise.reject() 静态方法返回一个已拒绝（rejected）的 Promise 对象，拒绝原因为给定的参数。
const p1 = Promise.reject("some error");

// 由于p1已拒绝，因此p1.then()中的onfulfilled回调不会被放入事件队列
// 但仍会有一个微任务被放入队列，该任务只将p2的状态由pending改为rejected，理由和p1的拒绝理由一样
// 所以p2的落定仍然是异步完成的
const p2 = p1.then(() => {
  console.log("p1 is resolved");
});

// 同步代码执行到此处是，p2的状态仍是pending，所以此时只是在p2上注册了一个回调，但该回调不会被放到事件队列上
p2.catch(() => console.log("p2 is rejectd"));

// Promise.resolve() 静态方法以给定值“解决（resolve）”一个 Promise。
// 如果该值本身就是一个 Promise，那么该 Promise 将被返回；
// 如果该值是一个 thenable 对象，Promise.resolve() 将调用其 then() 方法及其两个回调函数；
// 否则，返回的 Promise 将会以该值兑现。

// 由于p3已经解决，因此then()中的回调会被放入微任务事件队列中
const p3 = Promise.resolve().then(() => {
  console.log("p3 is resolved");
});

console.log("main");

// 微任务的执行顺序
// 1.p2的落定微任务（无输出，只进行状态转换）
// 2.p3.then的回调
// 3.p2.catch的回调

// 输出结果
// main
// p3 is resolved
// p2 is rejectd
//
