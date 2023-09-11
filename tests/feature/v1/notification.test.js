const DB = require("DB").default;
const User = require("~/app/models/User").default;
const Notification = require("~/app/models/Notification").default;
const NewUserJoined = require("~/app/notifications/NewUserJoined").default;

describe("Notification", () => {
  let user;
  let token;

  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async () => {
    await DB.reset();
    user = await User.factory().create();
    token = user.createToken();
  });

  it("Should get notifications", async () => {
    const notifications = await Notification.factory().count(2).create({ userId: user._id });
    const response = await request.get("/notifications").actingAs(token);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(notifications);
  });
  
  it("Should mark notification as read", async () => {
    let notification = await Notification.factory().unread().create({ userId: user._id });
    const response = await request.post("/notifications/" + notification._id).actingAs(token);
    expect(response.statusCode).toBe(200);
    notification = await Notification.findById(notification._id);
    expect(notification.readAt).not.toBeNull();
  });
  
  it("Shouldn't mark others notification as read", async () => {
    let notification = await Notification.factory().unread().create();
    const response = await request.post("/notifications/"+ notification._id).actingAs(token);
    expect(response.statusCode).toBe(404);
    notification = await Notification.findById(notification._id)
    expect(notification.readAt).toBeNull();
  });
  
  it("Shouldn't get others notifications", async () => {
    const [notifications] = await Promise.all([
      Notification.factory().count(2).create({ userId: user._id }),
      Notification.factory().create()
    ]);
    const response = await request.get("/notifications").actingAs(token);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(notifications);
  });
  
  it("Should get unread notifications count", async () => {
    await Promise.all([
      Notification.factory().count(2).unread().create({ userId: user._id }),
      Notification.factory().create({userId: user._id})
    ]);
    const response = await request.get("/notifications/unread-count").actingAs(token);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.count).toBe(2);
  });
  
  it("Should delete notification", async () => {
    let notification = await Notification.factory().create({ userId: user._id });
    const response = await request.delete(`/notifications/${notification._id}`).actingAs(token);
    expect(response.statusCode).toBe(204);
    notification = await Notification.findById(notification._id);
    expect(notification).toBeNull();
  });
  
  it("Shouldn't delete others notification", async () => {
    let notification = await Notification.factory().create();
    const response = await request.delete(`/notifications/${notification._id}`).actingAs(token);
    expect(response.statusCode).toBe(404);
    notification = await Notification.findById(notification._id);
    expect(notification).not.toBeNull();
  });
});
