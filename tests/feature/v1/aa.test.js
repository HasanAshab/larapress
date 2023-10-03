const DB = require("DB").default;
const User = require("~/app/models/User").default;

describe("Aaa", () => {
  let admin;
  let token;
  


  it("Ehhe", { user: false }, async () => {
    //await DB.connect()
    const responses = await Promise.all([
      request.get("/t1"),
      request.get("/t2"),
    ]);
    console.log(responses.map(r => r.body))
    //expect(response.statusCode).toBe(403);
  });
  
});
