const Job = require(base('illuminate/jobs/Job'));

class Test extends Job {
  dispatch = async (data) => {
    console.log(data)
  }
}

module.exports = Test;