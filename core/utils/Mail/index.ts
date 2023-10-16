import { util } from "~/core/decorators/class";
import Mailable from "~/core/abstract/Mailable";
import SendMail from "~/app/jobs/SendMail";

@util("~/core/utils/Mail/Mockable")
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