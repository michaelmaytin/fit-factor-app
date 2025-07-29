// src/workers/clockWorker.js
setInterval(() => {
  const now = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  postMessage(now); // send to main thread
}, 1000);
