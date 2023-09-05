const DB = require("~/core/utils/DB").default;
const User = require("~/app/models/User").default;


describe("Custom", () => {
  let admin;
  let token;
  
  beforeAll(async () => {
    //await DB.connect();
  });
  
  beforeEach(async (config) => {
    console.log(config)
    //await DB.reset();
    //admin = await User.factory({ events: false }).create({ role: "admin" });
    //token = admin.createToken();
  });

  it("Foo", { skipBeforeEach: true }, async () => {
    console.log(admin)
  });

  it("Bar", async () => {
    console.log(admin)
  });
  
  it("Baz", {foo: 3}, async () => {
    console.log(admin)
  });
});
