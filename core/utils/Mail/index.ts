import Mailable from "~/core/abstract/Mailable";
import SendMail from "~/app/jobs/SendMail";

export default class Mail {
  static to(email: string) {
    const send = (mailable: Mailable) => {
      if(mailable.shouldQueue)
        return SendMail.dispatch({ mailable, email });
      return SendMail.withoutQueue().dispatch({ mailable, email });
    }
    return { send };
  }
}