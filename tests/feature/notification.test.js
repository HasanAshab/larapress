const app = require("main/app").default;
const request = require("supertest")(app);
const DB = require("illuminate/utils/DB").default;
const User = require("app/models/User").default;
const Notification = require("app/models/Notification").default;
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

  it("Shouldn't access notification endpoints without auth-token", async () => {
    const notificationEndpoints = [
      "notifications",
      "notifications/unread-count",
      "notifications/foo"
    ];
    for(endpoint of notificationEndpoints) {
      const response = await request.get(`/api/v1/${endpoint}`)
      expect(response.statusCode).toBe(401);
    }
  });

  it("Should get notifications", async () => {
    const notifications = await Notification.factory(3).create({notifiableId: user._id});
    const response = await request.get("/api/v1/notifications")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.notifications).toHaveLength(3);
  });
  
  it("Should mark notification as read", async () => {
    let notification = await Notification.factory().create({notifiableId: user._id, readAt: null});
    const response = await request.post("/api/v1/notifications/"+notification._id)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    notification = await Notification.findById(notification._id)
    expect(notification.readAt).not.toBeNull();
  });
  
  it("Shouldn't mark others notification as read", async () => {
    let notification = await Notification.factory().create({readAt: null});
    const response = await request.post("/api/v1/notifications/"+notification._id)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    notification = await Notification.findById(notification._id)
    expect(notification.readAt).toBeNull();
  });
  
  it("Shouldn't get others notifications", async () => {
    const notifications = await Notification.factory(3).create({notifiableId: user._id});
    const othersNotifications = await Notification.factory().create();
    const response = await request.get("/api/v1/notifications")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.notifications).toHaveLength(3);
  });
  
  it("Should get unread notifications count", async () => {
    const unreadNotifications = await Notification.factory(2).create({notifiableId: user._id, readAt: null});
    await Notification.factory().create({notifiableId: user._id});
    const response = await request.get("/api/v1/notifications/unread-count")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.count).toBe(unreadNotifications.length);
  });
  
  it("Should delete notification", async () => {
    const notifications = await Notification.factory(3).create({notifiableId: user._id});
    const response = await request.delete(`/api/v1/notifications/${notifications[0]._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(204);
    expect(await user.notifications.count()).toBe(2);
  });
  
  it("Shouldn't delete others notification", async () => {
    let notification = await Notification.factory().create();
    const response = await request.delete(`/api/v1/notifications/${notification._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(204);
    notification = await Notification.findById(notification._id);
    expect(notification).not.toBeNull();
  });
});
