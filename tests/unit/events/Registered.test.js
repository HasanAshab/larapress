const app = require(base('main/app'));
const DB = require(base("illuminate/utils/DB"));

//DB.connect();
//resetDatabase();

describe('events/Registered', () => {
  it('Should work', async () => {
    expect(true).toBe(true);
  });
});
