const fs = require("fs");
const path = require("path");

// fs模块的低级方法
// fs.open(path, flags[, mode], callback)
// fs.read(fd, buffer, offset, length, position, callback)
// fs.write(fd, buffer, offset, length, position, callback)
// fs.close(fd, callback)

// fd : 文件描述符，是一个整数，表示打开的文件的标识符
//      0 : 标准输入（stdin）
//      1 : 标准输出（stdout）
//      2 : 标准错误输出（stderr）
// flags : 文件打开的方式，常用的有以下几种
//      'r' : 以只读方式打开文件，文件必须存在，否则会报错
//      'w' : 以写入方式打开文件，如果文件不存在则创建，如果文件存在则清空内容
//      'a' : 以追加方式打开文件，如果文件不存在则创建，如果文件存在则在末尾追加内容
// mode : 文件的权限，默认为0o666（可读可写），可以使用八进制表示权限，
//        例如0o777（可读可写可执行），0o755（所有者可读可写可执行，其他用户可读可执行），0o644（所有者可读可写，其他用户可读）
// buffer : 用于存储读取或写入数据的缓冲区，通常使用Buffer.alloc(size)创建一个指定大小的缓冲区
// offset : 缓冲区中开始存储数据的位置，默认为0
// length : 要读取或写入的字节数，默认为缓冲区的长度
// position : 文件中开始读取或写入的位置，默认为文件的当前指针位置，如果为null则表示从当前位置开始读取或写入
// callback : 回调函数，接受错误对象和其他相关参数，
//            例如fs.open的回调函数接受一个错误对象和一个文件描述符参数，fs.read的回调函数接受一个错误对象、读取的字节数和缓冲区参数

// 低级方法的使用示例
// 1. 打开文件并读取内容
// 打开文件
fs.open(path.join(__dirname, "read.txt"), "r", (err, fd) => {
  console.log("----- fs.open() -----");
  if (err) return console.log(err);
  console.log("文件打开成功，文件描述符为：", fd);

  // 读取文件
  console.log("----- fs.read() -----");
  const buffer = Buffer.alloc(1024);
  fs.read(fd, buffer, 0, buffer.length, 0, (err, bytesRead, buffer) => {
    if (err) return console.log(err);
    console.log(
      `读取了 ${bytesRead} 字节的数据：\n${buffer.toString("utf-8", 0, bytesRead)}`,
    );

    // 关闭文件
    console.log("----- fs.close() -----");
    fs.close(fd, (err) => {
      if (err) return console.log(err);
      console.log("文件已关闭");
    });
  });
});

// 2. 打开文件并写入内容
// 打开文件
fs.open(path.join(__dirname, "write.txt"), "w", (err, fd) => {
  console.log("----- fs.open() -----");
  if (err) return console.log(err);
  console.log("文件打开成功，文件描述符为：", fd);

  // 写入文件
  const buffer = Buffer.from("hello world, this is a test.");
  console.log("----- fs.write() -----");
  fs.write(fd, buffer, 0, buffer.length, 0, (err, written, buffer) => {
    if (err) return console.log(err);
    console.log(
      `写入了 ${written} 字节的数据：\n${buffer.toString("utf-8", 0, written)}`,
    );

    // 关闭文件
    console.log("----- fs.close() -----");
    fs.close(fd, (err) => {
      if (err) return console.log(err);
      console.log("文件已关闭");
    });
  });
});
