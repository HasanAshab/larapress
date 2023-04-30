const Queueable = require(base('illuminate/queue/Queueable'));

class NewUserJoinedMail extends Queueable {
  view = 'newUserJoined';
  subject = 'NewUserJoined';
  shouldQueue = true;
  
  constructor(data = {}){
    super()
    this.data = data;
  }
  
}

module.exports = NewUserJoinedMail;