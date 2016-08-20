'use strict';

const WebSocket = require('ws');
const hostname = require('os').hostname();
const cluster = require('cluster');
const CLUSTER_COUNT = 2;

if(cluster.isMaster){
  for(let i = 0; i < CLUSTER_COUNT; i++){
    cluster.fork();
  }
}else{
  const wss = WebSocket.Server({port: 8080});
  wss.on('connection', function connection(ws) {
    const interval = setInterval(() => {
      ws.send(`Connection: ${hostname} --- Worker: ${cluster.worker.id}`);
    }, 1000);
    ws.on('close', () => {
      clearInterval(interval);
    });
  });
}
