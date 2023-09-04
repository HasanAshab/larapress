const DB = require("~/core/utils/DB").default;
const Contact = require("~/app/models/Contact").default;
const User = require("~/app/models/User").default;

describe("Contact", () => {
  let admin;
  let token;
  
  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async () => {
    await DB.reset();
    admin = await User.factory({ events: false }).create({ role: "admin" });
    token = admin.createToken();
  });

  it.only("Should post contact", async () => {
    const data = Contact.factory().dummyData();
    const response = await request.post("/contact").send(data);

    expect(response.statusCode).toBe(201);
    expect(await Contact.findOne(data)).not.toBeNull();
  });
  
  it("Contact data should be sanitized", async () => {
    const data = {
      email: "foo@gmail.com",
      subject: "I'm trying XXS",
      message: "just a test, btw do u know i have a little experience of hacking??"
    };
    const script = "<script>alert('hacked')</script>";

    const response = await request.post("/v1/contact").send({
      email: data.email,
      subject: data.subject + script,
      message: data.message + script
    });
    expect(response.statusCode).toBe(201);
    expect(await Contact.findOne(data)).not.toBeNull();
  });
  
  it("Contact management endpoints shouldn't be accessible by novice", async () => {
    const user = await User.factory({ events: false }).create();
    const userToken = user.createToken();
  
    const requests = [
      request.get("/v1/contact/inquiries"),
      request.get("/v1/contact/inquiries/fooId"),
      request.delete("/v1/contact/inquiries/fooId"),
      request.put("/v1/contact/inquiries/fooId/status"),
      request.get("/v1/contact/inquiries/search"),
    ];
  
    const responses = await Promise.all(
      requests.map((request) => request.set("Authorization", `Bearer ${userToken}`))
    );
  
    const isNotAccessable = responses.every((response) => response.statusCode === 403);
    expect(isNotAccessable).toBe(true);
  });
  
  it("Should get all contacts", async () => {
    const response = await request.get("/v1/contact");
  });
  
  it("Should get contact by id", async () => {
    const response = await request.get("/v1/contact");
  });
  
  it("Should delete contact by id", async () => {
    const response = await request.get("/v1/contact");
  });

  it("Should search contacts", async () => {
    const response = await request.get("/v1/contact");
  });
  
  it("Should filter search contacts", async () => {
    const response = await request.get("/v1/contact");
  });
  
  it("Should update contact status", async () => {
    const response = await request.get("/v1/contact");
  });

});
