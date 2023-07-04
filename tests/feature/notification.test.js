const app = require("main/app").default;
const request = require("supertest")(app);
const DB = require("illuminate/utils/DB").default;
const User = require("app/models/User").default;
//const Notification = require("app/models/Notification").default;
const Notification = require("illuminate/utils/Notification").default;
const NewUserJoined = require("app/notifications/NewUserJoined").default;

describe("Notification", () => {
  let user;
  let token;

  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async () => {
    await resetDatabase();
    user = await User.factory().create();
    token = user.createToken();
  });

  it("Should get notifications", async () => {
    const response = await request.get("/api/v1/notifications")
      .set("Authorization", `Bearer ${token}`);
    Notification.mock();
    Notification.send({}, new NewUserJoined({name: "bla"}))
    Notification.assertSentTo({}, "NewUserJoined")
    console.log(response.body)
    expect(response.statusCode).toBe(200);
  });
});
