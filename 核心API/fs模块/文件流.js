const fs = require("fs");
const path = require("node:path");

// fs模块的流式方法
// fs.createReadStream(path[, options])
// fs.createReadStream的参数说明
// path : 文件路径，可以是字符串、Buffer或URL对象
// options : 可选参数，可以是一个对象或字符串，包含以下属性
//      encoding : 文件编码，默认为null，表示返回一个Buffer对象，可以设置为'utf-8'等常见编码格式
//      highWaterMark : 每次读取的字节数，默认为64KB，可以根据需要调整
//      flags : 文件打开的方式，默认为'r'，表示以只读方式打开文件，可以设置为'w'、'a'等常见方式
//      mode : 文件的权限，默认为0o666（可读可写），可以使用八进制表示权限，例如0o777（可读可写可执行），0o755（所有者可读可写可执行，其他用户可读可执行），0o644（所有者可读可写，其他用户可读）
//      autoClose : 是否自动关闭文件，默认为true，如果设置为false则需要手动调用stream.close()方法关闭文件
//      emitClose : 是否在文件关闭时触发'close'事件，默认为true

// fs.createWriteStream(path[, options])
// fs.createWriteStream的参数说明
// path : 文件路径，可以是字符串、Buffer或URL对象
// options : 可选参数，可以是一个对象或字符串，包含以下属性
//      encoding : 文件编码，默认为'utf-8'，表示以字符串形式写入文件，可以设置为其他编码格式
//      highWaterMark : 每次写入的字节数，默认为16KB，可以根据需要调整
//      flags : 文件打开的方式，默认为'w'，表示以写入方式打开文件，如果文件不存在则创建，如果文件存在则清空内容，可以设置为'a'等常见方式
//      mode : 文件的权限，默认为0o666（可读可写），可以使用八进制表示权限，例如0o777（可读可写可执行），0o755（所有者可读可写可执行，其他用户可读可执行），0o644（所有者可读可写，其他用户可读）
//      autoClose : 是否自动关闭文件，默认为true，如果设置为false则需要手动调用stream.close()方法关闭文件
//      emitClose : 是否在文件关闭时触发'close'事件，默认为true

// 流式方法的使用示例
// 1. 创建一个可读流并读取文件内容
const readStream = fs.createReadStream(path.join(__dirname, "read.txt"), {
  encoding: "utf-8",
  highWaterMark: 10,
});
console.log("----- fs.createReadStream() -----");
readStream.on("error", (err) => {
  console.log(err);
});
readStream.on("open", () => {
  console.log("文件已打开");
});
readStream.on("ready", () => {
  console.log("文件已准备好读取");
});
readStream.on("data", (chunk) => {
  console.log(`读取到${chunk.length}字节数据：${chunk.toString("utf-8")}`);
});
readStream.on("end", () => {
  console.log("文件读取完成");
});
readStream.on("close", () => {
  console.log("文件已关闭");
});
