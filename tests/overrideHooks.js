let setup;
global.beforeEach = function(cb) {
  setup = cb;
}

const realIt = global.it;
// TODO only, except methods
const runTest = function(summery, config, cb, method ) {
  const wrappedCb = async () => {
    if(!cb) {
      cb = config;
      config = {};
    }
    if(!config.skipBeforeEach) {
      await setup(config);
    }
    await cb();
  };
  if(method) 
    realIt[method](summery, wrappedCb);
  else realIt(summery, wrappedCb);
}

global.it = (...args) {
  runTest(...args);
}
global.it.skip = (...args) {
  runTest(...args, "skip");
}
global.it.except = (...args) {
  runTest(...args, "except");
}
