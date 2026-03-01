// 类的定义

// 用类表达式给变量赋值
var MyClass = class {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
};

// 类声明
class Counter {
  // 静态属性
  static total = 0;

  // 私有静态属性，前面的#表示属性为私有，仅能在类定义体中使用
  // #num : 类的实例的数目
  static #num = 0;

  // 成员私有属性，
  //  1) 前面的#表示属性为私有，仅能在类定义体中使用
  //  2) 必须先用#varname的方式声明属性，才能在构造函数等方法中使用属性
  //  3) 子类无法访问父类的私有属性
  #name;
  #age;

  // 构造函数
  constructor(name, age) {
    // 私有属性
    this.#age = age;
    this.#name = name;

    // 可访问属性
    this.total = 0;

    Counter.#num++; // 实例数目加1
    Counter.total++;
  }

  // 访问器属性
  get name() {
    return this.#name;
  }
  set name(value) {
    this.#name = value;
  }

  // 实例方法
  add() {
    this.total++;
  }

  // 静态方法
  static getNum() {
    return this.#num;
  }
}

let ctr1 = new Counter("gaofei", 39);
console.log(Counter.total);
console.log(Counter.getNum());
console.log(ctr1.name);
ctr1.add();
ctr1.name = "taotao";
console.log(ctr1.name);
console.log(ctr1.total);
console.log("----------------------");

let ctr2 = new Counter("taotao", 1.5);
console.log(Counter.total);
console.log(Counter.getNum());
