jest.unmock('Notification'); 
jest.mock("Mail");

const Notification = require("Notification").default;
const Mail = require("Mail").default;
const User = require("~/app/models/User").default;
const BaseNotification = require("~/core/abstract/Notification").default;

class TestMail {}

class TestNotification extends BaseNotification {
  via = () => ["email", "site"];
  toSite = () => ({});
  toEmail() {
    return new TestMail();
  }
}

describe("notification", () => {
  beforeEach(() => {
    Mail.mockClear();
  });
  
  it.only("Should send notification via email", async () => {
    console.log(Notification.send)
    class Test extends TestNotification {
      via = () => ["email"];
    }
    const user = await User.factory().make();
    console.log(user)
    await Notification.send(user, new Test);
    Mail.assertSentTo(user.email, TestMail);
  });
  
  it("Should send notification via site (database)", async () => {
    const user = await User.factory().make();
    class Test extends TestNotification {
      via = () => ["site"];
      sendSite(notifiable) {
        expect(user).toBe(notifiable);
      }
    }
    await Notification.send(user, new Test);
  });

  it("Should send notification to multiple users", async () => {
    const users = await User.factory().count(2).make();
    class Test extends TestNotification {
      via = () => ["email"];
    }
    await Notification.send(users, new Test);
    users.forEach(({ email }) => {
      Mail.assertSentTo(email, TestMail);
    });
  });
  
  it("Should send notification via multiple channels", async () => {
    const user = await User.factory().make();
    class Test extends TestNotification {
      sendSite(notifiable) {
        expect(user).toBe(notifiable);
      }
    }
    await Notification.send(user, new Test);
    Mail.assertSentTo(user.email, TestMail);
  });
  
  it("Shouldn't send notification immedietly in queued Notification", async () => {
    const user = await User.factory().make();
    user._id = 10100;
    class Test extends TestNotification {
      shouldQueue = true;
      via = () => ["email"];
    }
    await Notification.send(user, new Test);
    Mail.assertNothingSent();
    //SendNotification.assertDispatched();
  });

});
