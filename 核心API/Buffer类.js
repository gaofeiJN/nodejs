// 为什么需要 Buffer？
// JavaScript 中的字符串是 UTF-16 编码的，处理二进制数据（如图片、压缩文件、网络包）时效率低且容易出错。
// Buffer 提供了一块固定大小的原始内存分配，可以在 V8 堆之外操作二进制数据，性能更高。
// 常用于处理流数据（如 fs.createReadStream 产生的数据块）、TCP 流、数据库二进制字段等。

// Buffer 的核心特性
// 大小固定：创建 Buffer 时需指定大小，之后不能动态调整（但可以截取部分）。
// 直接操作内存：数据以字节（0-255）形式存储，可通过索引访问或修改。
// 与 TypedArray 的关系：Buffer 是 Uint8Array 的子类，因此可以与其他 TypedArray 互操作。
// 全局可用：无需 require('buffer')，直接使用 Buffer 即可。

const { Buffer } = require("node:buffer");

// 创建 Buffer 的方法

// 静态方法 Buffer.from()：根据输入创建 Buffer 实例，输入可以是字符串、数组、ArrayBuffer 等。
// Buffer.from(string[, encoding])：根据字符串创建 Buffer，encoding 默认为 'utf-8'。
// Buffer.from(array)：根据字节数组创建 Buffer。
console.log("--- Buffer.from(string | array) ---");
const bufA = Buffer.from("Hello, World!"); // 创建一个包含字符串 "Hello, World!" 的 Buffer
const bufB = Buffer.from([72, 101, 108, 108, 111]); // 创建一个包含字节数组 [72, 101, 108, 108, 111] 的 Buffer，对应字符串 "Hello"
const bufC = Buffer.from(new Uint8Array([72, 101, 108, 108, 111])); // 创建一个包含 Uint8Array 的 Buffer，效果同上
console.log("bufA: ", bufA.toString()); // 输出: Hello, World!
console.log("bufB: ", bufB.toString()); // 输出: Hello
console.log("bufC: ", bufC.toString()); // 输出: Hello

// Buffer.from() 还可以接受 ArrayBuffer 和 SharedArrayBuffer 作为输入，创建对应的 Buffer 实例。
console.log("--- Buffer.from(ArrayBuffer | SharedArrayBuffer) ---");
const arrayBuffer = new ArrayBuffer(5);
const uint8Array = new Uint8Array(arrayBuffer);
uint8Array.set([72, 101, 108, 108, 111]);
const bufD = Buffer.from(arrayBuffer); // 从 ArrayBuffer 创建 Buffer，Buffer 会共享同一块内存
console.log("bufD: ", bufD.toString()); // 输出: Hello

// 修改 ArrayBuffer 中的数据会反映在 Buffer 中，因为它们共享同一块内存
uint8Array[0] = 87; // 修改 ArrayBuffer 中的数据
console.log("bufD after modification: ", bufD.toString()); // 输出: Wello（Buffer 反映了 ArrayBuffer 的修改）

// 静态方法 Buffer.from(buffer)：根据另一个 Buffer 创建一个新的 Buffer，内容相同但内存独立。
console.log("--- Buffer.from(buffer) ---");
const bufE = Buffer.from(bufA); // 创建一个新的 Buffer，内容与 bufA 相同，但内存独立
console.log("bufE: ", bufE.toString()); // 输出: Hello, World!
bufE[0] = 104; // 修改 bufE 的第一个字节，将 'H' 改为 'h'
console.log("bufE after modification: ", bufE.toString()); // 输出: hello, World!（bufE 被修改了）
console.log("bufA after bufE modification: ", bufA.toString()); // 输出: Hello, World!（bufA 没有被修改，说明内存独立）

// 静态方法 Buffer.alloc()：创建一个指定大小的 Buffer，并可选择性地初始化内容。
// Buffer.alloc(size[, fill[, encoding]])
// size：Buffer 的大小（字节数）。
// fill：可选，指定 Buffer 的初始内容，默认为 0。可以是数字、字符串或 Buffer。
// encoding：当 fill 是字符串时，指定编码方式，默认为 'utf-8'。
console.log("--- Buffer.alloc(size[, fill[, encoding]]) ---");
const buf1 = Buffer.alloc(10); // 创建一个长度为 10 的 Buffer，内容初始化为 0
const buf2 = Buffer.alloc(10, 1); // 创建一个长度为 10 的 Buffer，内容初始化为 1
const buf3 = Buffer.alloc(10, "a"); // 创建一个长度为 10 的 Buffer，内容初始化为字符 'a'
const buf4 = Buffer.alloc(12, "好", "utf-8"); // 创建一个长度为 12 的 Buffer，内容初始化为字符串 '好'，使用 UTF-8 编码
console.log("buf1: ", buf1.toString("hex")); // 输出: 00000000000000000000（10 个字节，内容为 0）
console.log("buf2: ", buf2.toString("hex")); // 输出: 01010101010101010101（10 个字节，内容为 1）
console.log("buf3: ", buf3.toString("utf-8")); // 输出: aaaaaaaaaa（10 个字节，内容为 'a'）
console.log("buf4: ", buf4.toString("utf-8")); // 输出: 好好好好（12 个字节，内容为 '好'）

// 静态方法 Buffer.allocUnsafe()：创建一个指定大小的 Buffer，但不初始化内容，性能更高但可能包含敏感数据。
// Buffer.allocUnsafe(size)
// size：Buffer 的大小（字节数）。
console.log("--- Buffer.allocUnsafe(size) ---");
const buf5 = Buffer.allocUnsafe(10); // 创建一个长度为 10 的 Buffer，内容未初始化，可能包含随机数据
buf5.fill(0); // 将 buf5 的内容填充为 0，确保安全使用
console.log("buf5: ", buf5.toString("hex")); // 输出: 00000000000000000000（10 个字节，内容为 0）

// 使用数组语法访问 Buffer
console.log("--- 使用数组语法访问 Buffer ---");
const buf = Buffer.from("Hello");
console.log(buf[0]); // 输出: 72（'H' 的 ASCII 码）
buf[0] = 104; // 修改第一个字节，将 'H' 改为 'h'
console.log(buf.toString("utf-8")); // 输出: hello

// Buffer 的常用方法
// buf.toString([encoding[, start[, end]]])：将 Buffer 转换为字符串，默认编码为 'utf-8'。
// buf.slice([start[, end]])：返回 Buffer 的一个子 Buffer，类似于 Array.prototype.slice()。
// buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])：将 Buffer 的内容复制到另一个 Buffer 中。
// buf.fill(value[, offset[, end]][, encoding])：用指定的值填充 Buffer 的内容。

// buf.slice([start[, end]]) 方法返回一个新的 Buffer，包含原 Buffer 的一部分数据，但它们共享同一块内存，因此修改其中一个会影响另一个。
// start 和 end 参数指定了要截取的范围，默认为整个 Buffer。
// start 可以是负数，表示从 Buffer 的末尾开始计算；end 也可以是负数，表示从 Buffer 的末尾开始计算。
// start Where the new Buffer will start. Default: 0.
// end Where the new Buffer will end (not inclusive). Default: buf.length.
console.log("--- buf.slice([start[, end]]) ---");
const original = Buffer.from("Hello, World!");
const sliced = original.slice(0, 5);
console.log("original: ", original.toString()); // 输出: Hello, World!
console.log("sliced: ", sliced.toString()); // 输出: Hello
sliced[0] = 104; // 修改 sliced 的第一个字节，将 'H' 改为 'h'
console.log("original after modification: ", original.toString()); // 输出: hello, World!（original 也被修改了，因为它们共享同一块内存）
