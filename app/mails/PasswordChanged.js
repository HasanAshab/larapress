class PasswordChanged {
  view = 'passwordChanged';
  subject = `Your ${process.env.APP_NAME} Password Has Been Updated`;
  
  constructor(data = {}){
    this.data = data
  }
}

module.exports = PasswordChanged;