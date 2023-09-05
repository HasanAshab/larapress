let setup;
global.beforeEach = function(cb) {
  setup = cb;
}

const realIt = global.it;
global.it = function(summery, config, cb) {
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
  
  realIt(summery, wrappedCb);
}

