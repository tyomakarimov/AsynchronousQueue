'use strict';

const exporto = require('./asynchronousQueue.js');

const Queue = exporto.Queue;

const color = exporto.color;

const random = number => Math.floor(Math.random() * number);

function User(user, company, priority) {
  this.user = user;
  this.company = company;
  this.priority = priority;
}

const finished = () => {
  console.log(color.green + 'Finished' + color.white);
};

const collectionOfUsers = (collection, numberOfUsers) => {
  const companies = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberOfCompanies = companies.length;
  let counter = 1;
  const arrayIterator = Array(numberOfUsers).keys();
  const arrayOfNumbers = [...arrayIterator];
  const priorities = arrayOfNumbers.map(value => value + 1);
  for (let i = 1; i <= numberOfUsers; i++) {
    const index = random(numberOfCompanies);
    const tasks = [];
    const numberOfTasks = random(3) + 1;
    const length = priorities.length;
    const indexOfPriority = random(length);
    for (let j = 0; j < numberOfTasks; j++) {
      tasks.push(`Task${counter}`);
      counter++;
    }
    const user = new User(
      i,
      companies.charAt(index),
      priorities[indexOfPriority]
    );
    priorities.splice(indexOfPriority, 1);
    Object.setPrototypeOf(user, {});
    collection.set(user, tasks);
  }
  return collection;
};

const map = new Map();

collectionOfUsers(map, 8);

const queue = new Queue();

// FIRST CASE

// queue.start(console.log, finished);

for (const [key, value] of map.entries()) {
  queue.push(key, value);
}

// SECOND CASE

queue.init().start(console.log, finished);

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
