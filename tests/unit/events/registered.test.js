const app = require(base('main/app'));
const DB = require(base("illuminate/utils/DB"));
const nodemailerMock = require("nodemailer-mock");
const Mail = require(base('illuminate/utils/Mail'));
const User = require(base('app/models/User'));
const SendEmailVerificationNotification = require(base('app/listeners/SendEmailVerificationNotification'));
const SendNewUserJoinedNotificationToAdmins = require(base('app/listeners/SendNewUserJoinedNotificationToAdmins'));


describe('Registered Event', () => {
  let user;
  
  beforeAll(async () => {
    Mail.mock();
    await DB.connect();
  });

  afterAll(async () => {
    await DB.disconnect();
  });

  beforeEach(async () => {
    await resetDatabase();
    nodemailerMock.mock.reset();
    user = await User.factory().create();
  });
  
  it('should send verification email', async () => {
    await SendEmailVerificationNotification.dispatch(user);
    const mails = nodemailerMock.mock.getSentMail();
    expect(mails).toHaveLength(1);
    expect(mails[0].to).toBe(user.email);
    expect(mails[0].template).toBe('verification');
  });
  
  it('should notify admins about new user', async () => {
    const admins = await User.factory(3).create({isAdmin:true});
    await SendNewUserJoinedNotificationToAdmins.dispatch(user);
    const mails = nodemailerMock.mock.getSentMail();
    expect(mails).toHaveLength(3);
    for(let i = 0; i < 3; i++){
      expect(mails[i].to).toBe(admins[i].email);
      expect(mails[i].template).toBe('newUserJoined');
    }
  });
});
