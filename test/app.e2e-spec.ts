process.env.DATABASE_URL =
  "postgresql://postgres:Remael123@localhost:5432/testdb?schema=test_db";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as cookieParser from "cookie-parser";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "./../src/app.module";
import * as pactum from "pactum";
import { CreateUserDto } from "../src/users/dto/createuser.dto";

describe("app-e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    await prisma.restoreDb();
  });

  afterAll(async () => {
    await app.close();
  });
  describe("Auth", () => {
    describe("signup", () => {
      it("should sign up", async () => {
        const dto: CreateUserDto = {
          email: "xoten57481@miarr.com",
          firstName: "Michael",
          lastName: "Mambo",
          password: "Michael1234",
          confirmPassword: "Michael1234",
          country: "Kenya",
          role: "freelancer",
        };

        return pactum
          .spec()
          .post("http://localhost:3333/auth/signup")
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe("login", () => {
      it.todo("should log in");
    });
  });
});
