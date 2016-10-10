/**
 * Exercise 1: Classes
 */
let classesSuite = new TestSuite('Classes, Inheritance &amp; Accessor properties');
let e1 = window.exercise.one();

classesSuite.addTest(new TestCase('<code>Class1</code> cannot be constructed', () => {
  try {
    new e1.Class1();
    return false;
  } catch (e) {}
  return typeof e1 == "object" && typeof e1.Class1 == "function";
})); 

classesSuite.addTest(new TestCase('<code>Class2</code> is constructable &amp; extends <code>Class1</code>', () => {
  try {
    var c = new e1.Class2();
    return c instanceof e1.Class1;
  } catch (e) {
    console.log(e);
    return false;
  }
}));

let desc = `
  <code>Class2</code> has a property <code>number</code> which throws a error when it is assigned a value with a type other than number
`; 

classesSuite.addTest(new TestCase(desc, () => {
  try {
    var c = new e1.Class2(),
        values = ["a", true, undefined, null, () => {}, Symbol("a"), {}];
    for (let value of values) {
      try {
        c.number = value;
        return false
      } catch(e) {}
    }
    try {
      c.number = Math.PI;
      return true;
    } catch(e) {}
  } catch (e) {console.log(e);}
  return false;
}));

/**
 * Exercise 2: Itertables
 */
let iteratorSuite = new TestSuite('Iterable Objects &amp; Symbol.iterator');
let e2 = window.exercise.two();

iteratorSuite.addTest(new TestCase('<code>Iterable</code> has a <code>[Symbol.iterator]</code> method', () => {
  try {
    let iterable = new e2.Iterable();
    return typeof iterable[Symbol.iterator] == 'function';
  } catch(e) { 
    console.log(e);
    return false;
  }
}));

let testFibonacci = (iterable, max) => {
  let expected = [1,1],
      value = 2;
  while (value < max) {
    value = expected[expected.length - 1] + expected[expected.length - 2]; 
    if (value < max) {
      expected.push(value);
    }
  }
  
  let passed = true;
  for (value of iterable) {
    passed &= value === expected.shift();
  }
  return passed && expected.length === 0;
};

iteratorSuite.addTest(new TestCase('<code>Iterable</code> returns fibonacci numbers below 10 using <code>for-in</code>', () => {
  try { 
    let iterable = new e2.Iterable();
    return testFibonacci(iterable, 10);
  } catch(e) {console.log(e);}
  return false;
}));

iteratorSuite.addTest(new TestCase('The state of <code>Iterable</code> is reset properly (previous test passes twice in a row)', () => {
  try {
    let iterable = new e2.Iterable();
     return testFibonacci(iterable, 10) && testFibonacci(iterable, 10);
  } catch(e) {console.log(e);}
  return false;
}));

data = `
  <code>Iterable</code> constructor takes a argument <code>max</code>, then returns all fibonacci numbers below <code>max</code>
`;

iteratorSuite.addTest(new TestCase(data, () => {
  try {
    let iterable = new e2.Iterable(20); 
    return testFibonacci(iterable, 20);
  } catch(e) {console.log(e);}
  return false;
}));

/**
 * Exercise 3: Generators
 */
let generatorSuite = new TestSuite('Generators');
let e3 = window.exercise.three();

generatorSuite.addTest(new TestCase('<code>PiGenerator</code> generates the first 10 digits of Pi in a <code>for-of</code> loop', () => {
  let values = [3,1,4,1,5,9,2,6,5,3];
  try {
    let gen = new e3.PiGenerator();
    for (let val of gen) {
      if (val != values.shift()) {
        return false;
      }
    }
  } catch(e) { return false }
  return true;
}));

let taskRunner1 = new TestCase('<code>taskRunner</code> can run asynchronous tasks', () => {
  let failed = false,
      callback;
  function *def() {
    yield (cb) => {
      setTimeout(function() {
        cb();
      }, 2000);
    }

    yield (cb) => { 
      cb();
      callback({
        passed: true,
        test: taskRunner1
      }); 
    }
    failed = true;
  }
  
  try {
    e3.taskRunner(def);

    if (!failed) {
      return (cb) => {
        callback = cb;
      }
    }
  } catch(e) {}
  return false;
});

let taskRunner2 = new TestCase('<code>taskRunner</code> can run async and immediate tasks', () => { 
  let failed = false,
      callback;
  function *def() {
    yield (cb) => {
      setTimeout(function() {
        cb();
      }, 2000);
    }
    
    yield (cb) => { 
      cb();
    }

    yield (() => {
      callback({
        passed: true,
        test: taskRunner2
      }); 
      return 1; // Yield random value
    })()

    failed = true;
  }
  
  try {
    e3.taskRunner(def);

    if (!failed) {
      return (cb) => {
        callback = cb;
      }
    }
  } catch(e) {}
  return false;
});

generatorSuite.addTest(taskRunner1);
generatorSuite.addTest(taskRunner2);

new TestRunner(classesSuite, iteratorSuite, generatorSuite);
