'use strict';

const exporto = require('./asynchronousQueue.js');

const Queue = exporto.Queue;

const queue = new Queue();

const map = exporto.map;

const finished = exporto.finished;

// FIRST CASE

// queue.start(console.log, finished);

for (const [key, value] of map.entries()) {
  queue.push(key, value);
}

// SECOND CASE

queue.init()
  .start(console.log, finished);

// THIRD CASE

// queue.prioritise()
//   .init()
//   .start(console.log, finished);

// FOURTH CASE

// queue.setFactors('ABCDE')
//   .init()
//   .start(console.log, finished);

// FIFTH CASE

// queue.prioritise().setFactors('XYZ')
//   .init()
//   .start(console.log, finished);

//SIXTH CASE

// queue.start(console.log, finished);
