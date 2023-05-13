class Mail {
  constructor(email){
    this.email = email;
  }
  
  static to(email){
    return new Mail(email);
  }
  
  send(){
    console.log(this.email);
  }
}


Mail.to('jsjsj@gmail').send()