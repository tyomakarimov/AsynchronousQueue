'use strict';

const wait = (ms, task) => new Promise(resolve =>
  setTimeout(() =>
    resolve(task), ms));

const color = {
  red: '\x1b[1;31m',
  green: '\x1b[1;32m',
  yellow: '\x1b[1;33m',
  white: '\x1b[1;37m',
};

const SEPARATOR = '--------------------------------';

const factors = collection => {
  console.log(color.green + 'Factors of this Queue: ' +
    collection.join(', ') + color.white + '\n' + SEPARATOR);
};

const noFactors = () => {
  console.log(color.green + 'This Queue does not have factors' +
    color.white + '\n' + SEPARATOR);
};

class Queue {
  constructor() {
    this.data = new Map();
    this.users = [];
    this.usersByTasks = [];
    this.companies = [];
    this.priorities = [];
    this.arraysOfTasks = [];
    this.queue = [];
    this.timeouts = [];
    this.factorsOfQueue = [];
    this.pushed = false;
    this.prioritised = false;
    this.formed = false;
  }

  push(key, value) {
    this.pushed = true;
    this.data.set(key, value);
    this.users.push(key.user);
    this.companies.push(key.company);
    this.priorities.push(key.priority);
    this.arraysOfTasks.push(value);
    return this;
  }

  prioritise() {
    this.prioritised = true;
    return this;
  }

  setFactors(string = 'ABC') {
    this._applyFactors(string, this.companies, this.factorsOfQueue) ?
      factors(this.factorsOfQueue) : noFactors();
    return this;
  }

  _applyFactors(parameter, iterable, array) {
    iterable.forEach((value, index) => {
      const user = this.users[index];
      if (this._canBePushed(parameter, value)) array.push(user);
    });
    return array.length;
  }

  _canBePushed(parameter, value) {
    return typeof parameter === 'string' && parameter.includes(value);
  }

  _useFactors() {
    for (const value of this.factorsOfQueue) {
      const index = this.users.indexOf(value);
      const user = this.users[index];
      const elements = this.arraysOfTasks[index];
      const length = elements.length;
      this.queue.push(...elements);
      this.timeouts.push(...Array(length).fill(0.5));
      this.usersByTasks.push(...Array(length).fill(user));
      this.priorities[index] = 0;
    }
  }

  _usePriorities() {
    let timeout = 0;
    for (let i = 0; i < this.priorities.length; i++) {
      const max = this._maxElement(this.priorities);
      if (max) {
        timeout++;
        this._findPriority(timeout, max);
      }
    }
  }

  _maxElement(array) {
    return Math.max(...array);
  }

  _findPriority(timeout, max) {
    const indexOfMax = this.priorities.indexOf(max);
    const user = this.users[indexOfMax];
    const mapIterator = this.data.keys();
    const userData = Array.from(mapIterator);
    userData.filter(object => object.user === user)
      .map(object => {
        const tasks = this.data.get(object);
        this._addElementsToCollections(tasks, user, timeout);
      });
  }

  _noPriorities() {
    let timeout = 0;
    for (const tasks of this.arraysOfTasks) {
      const indexOfValue = this.arraysOfTasks.indexOf(tasks);
      if (this.priorities[indexOfValue]) {
        timeout++;
        const user = this.users[indexOfValue];
        this._addElementsToCollections(tasks, user, timeout);
      }
    }
  }

  _addElementsToCollections(tasks, user, timeout) {
    const index = this.arraysOfTasks.indexOf(tasks);
    this.queue.push(...tasks);
    const length = tasks.length;
    this.usersByTasks.push(...Array(length).fill(user));
    const intervals = Array(length).fill(timeout);
    this.priorities[index] = 0;
    if (length > 1) this._setIntervalsBetweenTasks(intervals, length);
    this.timeouts.push(...intervals);
  }

  _setIntervalsBetweenTasks(intervals, length) {
    const difference = 1 / length;
    for (let i = 0; i < length; i++) {
      intervals[i] += i * difference;
    }
  }

  init() {
    this.formed = true;
    if (this.factorsOfQueue.length) this._useFactors();
    if (this.prioritised) this._usePriorities();
    if (!this.prioritised) this._noPriorities();
    return this;
  }

  async start(fn, onEnd) {
    if (!this.pushed) throw new Error(color.red +
      'Queue is empty. You must add the elements first!' +
      color.white);
    if (!this.formed) throw new Error(color.red +
      'Queue has not been formed. You must use method init() !' +
      color.white);
    const waiting = [];
    for (let i = 0; i < this.queue.length; i++) {
      const timeout = this.timeouts[i] * 1000;
      const user = this.usersByTasks[i];
      const task = this.queue[i];
      const numberOfWaiting = this.queue.length - 1 - i;
      const statusText = color.yellow +
        task + ' from user ' + user + ', waiting: ' +
        numberOfWaiting + color.white + '\n' + SEPARATOR;
      waiting.push(wait(timeout, statusText));
    }
    for (const promise of waiting) {
      await promise.then(fn);
    }
    onEnd();
  }
}

// USAGE

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
  const priorities = arrayOfNumbers
    .map(value => value + 1);
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
    const user = new User(i,
      companies.charAt(index),
      priorities[indexOfPriority]);
    priorities.splice(indexOfPriority, 1);
    Object.setPrototypeOf(user, {});
    collection.set(user, tasks);
  }
  return collection;
};

const map = new Map();

collectionOfUsers(map, 8);

module.exports = {
  Queue,
  map,
  finished,
};
