const os = require("os");

// function cpus(): os.CpuInfo[]
let cpus = os.cpus();
// console.log(cpus);
//
// [
//   {
//     model: 'Intel(R) Core(TM) i5-8400 CPU @ 2.80GHz',
//     speed: 0,
//     times: { user: 29610, nice: 0, sys: 43700, idle: 6949550, irq: 0 }
//   },
//   {...}
// ]

let hostname = os.hostname();
// console.log(hostname); // localhost

let ipinfo = os.networkInterfaces();
// console.log(ipinfo);
//
// {
//   lo: [
//     {
//       address: '127.0.0.1',
//       netmask: '255.0.0.0',
//       family: 'IPv4',
//       mac: '00:00:00:00:00:00',
//       internal: true,
//       cidr: '127.0.0.1/8'
//     },
//     {
//       address: '::1',
//       netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
//       family: 'IPv6',
//       mac: '00:00:00:00:00:00',
//       internal: true,
//       cidr: '::1/128',
//       scopeid: 0
//     }
//   ],
//   eth0: [
//     {
//       address: '172.22.71.110',
//       netmask: '255.255.240.0',
//       family: 'IPv4',
//       mac: '00:15:5d:49:70:0a',
//       internal: false,
//       cidr: '172.22.71.110/20'
//     },
//     {
//       address: 'fe80::215:5dff:fe49:700a',
//       netmask: 'ffff:ffff:ffff:ffff::',
//       family: 'IPv6',
//       mac: '00:15:5d:49:70:0a',
//       internal: false,
//       cidr: 'fe80::215:5dff:fe49:700a/64',
//       scopeid: 2
//     }
//   ]
// }

let userInfo = os.userInfo();
// console.log(userInfo);
//
// [Object: null prototype] {
//   uid: 1000,
//   gid: 1000,
//   username: 'gaofei',
//   homedir: '/home/gaofei',
//   shell: '/bin/bash'
// }
