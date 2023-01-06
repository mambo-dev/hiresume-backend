import { Test, TestingModule } from "@nestjs/testing";
import { EmailService } from "./email.service";

describe("EmailService", () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });
  jest.setTimeout(20000);
  it("should send an email", () => {
    expect(
      service.sendEmail({
        to: "mambo.michael.22@gmail.com",
        from: "mambo.michael.22@gmail.com",
        subject: "This is a test email",
        text: "please work ",
        html: "<div>test email</div>",
      })
    ).toBeTruthy();
  });
});
