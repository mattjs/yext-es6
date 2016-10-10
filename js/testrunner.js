/**
 * Runs a set of suites and generates a navigation for the suites
 */
class TestRunner {
  /**
   * @param {Array.<TestSuite>} ..suites
   */
  constructor(...suites) {
    this.suiteTemplate = $('.js-test-suite-template').html();   
    this.resultTemplate = $('.js-test-result-template').html();
    this.suiteListItemTemplate = $('.js-suite-list-item-template').html(); 

    this.suites = suites;
    
    this.renderSuiteList();
  }
  
  renderSuiteList() {
    let items = [];
    for (let suite of this.suites) {
       let html = this.suiteListItemTemplate.replace('{{suiteName}}', suite.name);
       let $element = this.bindSuite(html, suite);
       items.push($element);
    }
    $('.js-suites-list').append(items);
  }

  bindSuite(html, suite) {
    const $element = $(html);
    $element.find('button').on('click', () => {
      this.runSuite(suite);
    });
    return $element;
  }

  runSuite(suite) {
    var $suite = $(this.suiteTemplate.replace('{{suiteName}}', suite.name));
    $('.js-test-results').empty().append($suite);
    for (let result of suite.run()) {
      if (typeof result.passed === 'function') { // Async result
        let $content = $(this.renderTestResult(result.test.name, 'pending'));
        $suite.find('ul').append($content);
        result.passed((result) => {
          let newContent = this.renderTestResult(
            result.test.name,
            result.passed ? 'passed' : 'failed');      
          $content.replaceWith(newContent);
        });
      } else {
        let content = this.renderTestResult(
          result.test.name,
          result.passed ? 'passed' : 'failed');      
        $suite.find('ul').append(content);
      }
    }
  }

  renderTestResult(testName, testStatus) {
    return this.resultTemplate
      .replace('{{testName}}', testName)
      .replace('{{testStatus}}', testStatus);
  }
}

/**
 * A set of related TestCase objects
 */
class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
  }

  addTest(test) {
    this.tests.push(test);
  }

  *run() {
    for (let test of this.tests) {
      yield {
        passed: test.run(),
        test: test
      }
    }
  }
}

/**
 * A single test in a suite
 */
class TestCase {
  
  /**
   * @param {string} name
   * @param {function} test
   */
  constructor(name, test) {
    this.name = name;
    this.test = test;
  }

  run() {
    return this.test(); 
  }
}

