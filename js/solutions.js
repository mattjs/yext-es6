window.exercise = {
  one() {
    class AbstractClass {
      constructor() {
        if (new.target == AbstractClass) {
          throw new Error('This guy is abstract');
        }
      }
    }

    class ConcreteClass extends AbstractClass {
      constructor() {
        super();
        this.number = 0;
      }

      set number(number) {
        if (typeof number !== "number") {
          throw new TypeError("Number can only be a number");
        }
        this._number = number;
      }
 
      get number() {
        return this._number;
      }
    }
    return {
      Class1: AbstractClass,
      Class2: ConcreteClass
    };
  },
  two() {
    class Iterable {
      constructor(max = 10) {
        this.max = max;
      }

      [Symbol.iterator]() {
        let last = 0,
            penultimate = 0;
        return {          
          next: () => {
            let value = last && penultimate ? last + penultimate : 1,
                done = value > this.max;
            penultimate = last;
            last = value;
            return {
              value: done ? undefined : value,
              done: done
            }
          }
        }
      }
    };
    return {
      Iterable
    }
  },
  three() {
    class PiGenerator {
      *[Symbol.iterator]() {
        let pi = String(Math.PI).replace('.', '').split('').slice(0,10);
        while (pi.length) {
          yield pi.shift();
        }
      }
    }

    /**
     * {function} definition A function that returns a generator
     */
    function taskRunner(definition) {
      let task = definition();
      
      // Start the task
      let result = task.next();
      
      let next = function() {
        if (!result.done) {
          if (typeof result.value === 'function') {
            result.value(function(data) {
              result = task.next(data);
              next();
            });
          } else {
            result = task.next(result);
            next();
          }
        }
      }
      next();
    }
 
    return {
      PiGenerator: PiGenerator,
      taskRunner: taskRunner
    }
  }
};
