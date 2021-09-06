import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { Policy } from "src/policies/models/policy";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendEmail(policy: Policy, email: string, firstName: string): void {
    this.mailerService
      .sendMail({
        to: email,
        from: "noreply@lemonade.com",
        subject: "Lemonade Policy ✔",
        text: "Thanks for working with Powerful Mortage! You are insured through Lemonade.",
        html: `<div>Thanks ${firstName} for working with Powerful Mortage! You are insured through Lemonade.See details of your policy below.</div> <br><br><br><div>Policy${JSON.stringify(
          policy,
          undefined,
          2
        )}</div>
        <br><br>
        Feel free to reach out anytime,<br>
        Drew`,
      })
      .then(() => {
        console.log(`Success! Email send to ${email}`);
      })
      .catch((error) => {
        console.log(`Error! Email did not send. Error: ${error}`);
      });
  }
}
