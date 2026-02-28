// ChatMsg类
// 一个ChatMsg类的实例是TCP聊天室中在服务端与客户端之间传递的一条消息
// 属性
//  type    : 消息的类型， NOTICE, LOGIN, PRIVATE, BROADCAST
//  from    : 消息的发送方
//  to      : 消息的接收方
//  content : 消息的内容

class ChatMsg {
  constructor(type, from, to, content) {
    this.type = type;
    this.from = from;
    this.to = to;
    this.content = content;
  }

  // 静态方法
  static sayHi() {
    console.log("hi");
  }

  static createChatMsg(type, from, to, content) {
    return new ChatMsg(type, from, to, content);
  }

  // 实例方法
  sayHello() {
    console.log("hello");
  }
}

const MSG_TYPES = {
  NOTICE: 0,
  LOGIN: 1,
  BROADCAST: 2,
  PRIVATE: 3,
};

export { ChatMsg, MSG_TYPES };
