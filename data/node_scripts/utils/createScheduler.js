const _ = require('lodash');

/**
 * Creates a simple scheduler that schedules functions passed to
 * schedule.schedule(fn). The functions will be run out of order, and will run
 * at random intervals between delayLow and delayHigh.
 */
module.exports = function createScheduler(delayLow, delayHigh /* optional */) {
  delayHigh = delayHigh || delayLow;

  const queue = [];
  var timeoutId = null;

  function runFunc(fn) {
    fn();
    scheduleNext();
  }

  function scheduleNext() {
    timeoutId = null;
    if (queue.length) {
      const nextFn = queue.pop();
      const delay = _.random(delayLow, delayHigh);
      timeoutId = setTimeout(() => runFunc(nextFn), delay);
    }
  }

  function schedule(fn) {
    queue.push(fn);
    if (!timeoutId) {
      scheduleNext();
    }
  }

  return {
    schedule
  };
};
