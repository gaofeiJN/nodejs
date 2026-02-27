const fs = require("node:fs/promises");
const path = require("node:path");

// fs模块的高级方法
// fs.readFile(path[, options])
// fs.readFile的参数说明
// path : 文件路径，可以是字符串、Buffer或URL对象
// options : 可选参数，可以是一个对象或字符串，包含以下属性
//      encoding : 文件编码，默认为null，表示返回一个Buffer对象，可以设置为'utf-8'等常见编码格式
//      flag : 文件打开的方式，默认为'r'，表示以只读方式打开文件，可以设置为'w'、'a'等常见方式
//      signal : 一个AbortSignal对象，用于取消正在进行的文件操作

// fs.writeFile(file, data[, options])
// fs.writeFile的参数说明
// file : 文件路径，可以是字符串、Buffer或URL对象
// data : 要写入文件的数据，可以是字符串、Buffer或TypedArray对象
// options : 可选参数，可以是一个对象或字符串，包含以下属性
//      encoding : 文件编码，默认为'utf-8'，表示以字符串形式写入文件，可以设置为其他编码格式
//      mode : 文件的权限，默认为0o666（可读可写），可以使用八进制表示权限，例如0o777（可读可写可执行），0o755（所有者可读可写可执行，其他用户可读可执行），0o644（所有者可读可写，其他用户可读）
//      flag : 文件打开的方式，默认为'w'，表示以写入方式打开文件，如果文件不存在则创建，如果文件存在则清空内容，可以设置为'a'等常见方式
//      signal : 一个AbortSignal对象，用于取消正在进行的文件操作

// fs.appendFile(file, data[, options])
// fs.appendFile的参数说明
// file : 文件路径，可以是字符串、Buffer或URL对象
// data : 要追加到文件的数据，可以是字符串、Buffer或TypedArray对象
// options : 可选参数，可以是一个对象或字符串，包含以下属性
//      encoding : 文件编码，默认为'utf-8'，表示以字符串形式追加到文件，可以设置为其他编码格式
//      mode : 文件的权限，默认为0o666（可读可写），可以使用八进制表示权限，例如0o777（可读可写可执行），0o755（所有者可读可写可执行，其他用户可读可执行），0o644（所有者可读可写，其他用户可读）
//      flag : 文件打开的方式，默认为'a'，表示以追加方式打开文件，如果文件不存在则创建，如果文件存在则在末尾追加内容，可以设置为'w'等常见方式
//      signal : 一个AbortSignal对象，用于取消正在进行的文件操作

// fs.copyFile(src, dest[, mode])
// fs.rename(oldPath, newPath)
// fs.unlink(path)
// fs.mkdir(path[, options])
// fs.rmdir(path[, options])
// fs.readdir(path[, options])
// fs.stat(path[, options])
// fs.lstat(path[, options])
// fs.access(path[, mode])

// 高级方法的使用示例
// 1. 读取文件内容
fs.readFile(path.join(__dirname, "read.txt"), "utf-8")
  .then((data) => {
    console.log("----- fs.readFile() -----");
    console.log(`文件内容为：\n${data}`);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log("文件读取操作完成");
  });

// 2. 写入文件内容
const buffer = Buffer.from("你好啊，世界！这是使用Buffer写入的内容");
fs.writeFile(path.join(__dirname, "write2.txt"), buffer, "utf-8")
  .then(() => {
    console.log("----- fs.writeFile() -----");
    console.log("文件写入成功");
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    console.log("文件写入操作完成");
  });
