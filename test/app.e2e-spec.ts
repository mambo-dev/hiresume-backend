process.env.DATABASE_URL =
  "postgresql://postgres:Remael123@localhost:5432/testdb?schema=test_db";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as cookieParser from "cookie-parser";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "./../src/app.module";
import * as pactum from "pactum";
import { CreateUserDto } from "../src/users/dto/createuser.dto";
import { CreateJobDto } from "../src/clients/dto/create-job.dto";
import { UpdateJobDto } from "../src/clients/dto/update-job.dto";
import { RateReviewDto } from "../src/clients/dto/rate-review.dto";
import {
  AddSkillsDto,
  CreateBioDto,
  CreateEducationDto,
  CreateExperienceDto,
} from "../src/freelancers/dto/create-bio.dto";
import {
  TYPE,
  UpdateAllProfileDto,
} from "../src/freelancers/dto/update-all.dto";
import { join } from "path";

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
    await prisma.cleanDb(["user", "job", "profile"]);
    pactum.request.setBaseUrl("http://localhost:3333");
  });

  afterAll(async () => {
    await app.close();
  });

  const createUserdto: CreateUserDto = {
    email: "solimi4764@miarr.com",
    firstName: "Michael",
    lastName: "Mambo",
    password: "Michael1234",
    confirmPassword: "Michael1234",
    country: "Kenya",
    role: "client",
  };
  describe("Auth", () => {
    describe("signup", () => {
      jest.setTimeout(50000);
      pactum.request.setDefaultTimeout(60000);
      it("should  sign up", async () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(createUserdto)
          .expectStatus(201)
          .stores("user_ver_code", "verificationCode");
      });

      it("should throw if user exists", async () => {
        const dto: CreateUserDto = {
          email: "solimi4764@miarr.com",
          firstName: "Michael",
          lastName: "Mambo",
          password: "Michael1234",
          confirmPassword: "Michael1234",
          country: "Kenya",
          role: "freelancer",
        };

        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto)
          .expectStatus(409);
      });
    });
    describe("login", () => {
      it("should log in", async () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody({
            username: "solimi4764@miarr.com",
            password: "Michael1234",
          })
          .expectStatus(201)
          .stores("user_access_tk", "access_token");
      });

      it("should throw if password is wrong", async () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody({
            username: "solimi4764@miarr.com",
            password: "Michael1235",
          })
          .expectStatus(401);
      });

      it("should not verify user account and  throw forbidden exception", () => {
        return pactum
          .spec()
          .post("/verify/ver-21321")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .expectStatus(403);
      });

      it("should verify user account", () => {
        return pactum
          .spec()
          .post("/verify/$S{user_ver_code}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .expectStatus(201);
      });

      it("should not verify user account", () => {
        return pactum
          .spec()
          .post("/verify/$S{user_ver_code}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .expectStatus(400);
      });
    });

    describe("account restore", () => {
      jest.setTimeout(20000);
      pactum.request.setDefaultTimeout(20000);
      it("should intiate password recovery by sending email", () => {
        return pactum
          .spec()
          .post("/forgot-password")
          .withBody({ email: createUserdto.email })
          .expectStatus(201);
      });
    });
  });
  describe("Job", () => {
    describe("create job", () => {
      const createJob: CreateJobDto = {
        job_title: "GraphQl React developer needed",
        job_description:
          "In need of a graphql developer to work on my new application idea kindly apply if interested",
        job_length: "1month",
        job_hourly_from: 20,
        job_hourly_to: 40,
        job_level: "entry",
        skills_required: [
          {
            skill_id: 4,
          },
          {
            skill_id: 3,
          },

          {
            skill_id: 1,
          },

          {
            skill_id: 19,
          },
        ],
      };
      it("should create a job", async () => {
        return pactum
          .spec()
          .post("/clients/create-job")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .withBody(createJob)
          .expectStatus(201)
          .stores("job_id", "id");
      });

      it("should fail if no job title", () => {
        const { job_title, ...result } = createJob;

        return pactum
          .spec()
          .post("/clients/create-job")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .withBody(result)
          .expectStatus(400);
      });
      it("should fail if no job description", () => {
        const { job_description, ...result } = createJob;

        return pactum
          .spec()
          .post("/clients/create-job")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .withBody(result)
          .expectStatus(400);
      });
    });

    describe("update job", () => {
      const updateJob: UpdateJobDto = {
        job_title: "Graphql Next js full stack developer",
      };
      it("should update job", () => {
        return pactum
          .spec()
          .put("/clients/update-job/$S{job_id}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .withBody(updateJob)
          .expectStatus(200);
      });

      it("should not update job", () => {
        return pactum
          .spec()
          .put("/clients/update-job/$S{job_id+=1}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .withBody(updateJob)
          .expectStatus(404);
      });
    });

    describe("delete job", () => {
      it("should delete job", () => {
        return pactum
          .spec()
          .delete("/clients/delete-job/$S{job_id}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .expectStatus(200);
      });

      it("should fail to delete", () => {
        return pactum
          .spec()
          .delete("/clients/delete-job/$S{job_id+=1}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .expectStatus(404);
      });
    });

    describe("freelancer logs in", () => {
      it("should create a freelancer", () => {
        const { email, role, ...result } = createUserdto;

        const freelancer = {
          ...result,
          email: "xoten57481@miarr.com",
          role: "freelancer",
        };
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(freelancer)
          .expectStatus(201);
      });
      it("should log in a freelancer", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody({
            username: "xoten57481@miarr.com",
            password: "Michael1234",
          })
          .expectStatus(201)
          .stores("freelancer_access_tk", "access_token")
          .stores("freelancer_id", "user_role_id");
      });
    });

    describe("bid Job", () => {
      const createJob: CreateJobDto = {
        job_title: "GraphQl React developer needed",
        job_description:
          "In need of a graphql developer to work on my new application idea kindly apply if interested",
        job_length: "1month",
        job_hourly_from: 20,
        job_hourly_to: 40,
        job_level: "entry",
        skills_required: [
          {
            skill_id: 4,
          },
          {
            skill_id: 3,
          },

          {
            skill_id: 1,
          },

          {
            skill_id: 19,
          },
        ],
      };
      it("should create a job", async () => {
        return pactum
          .spec()
          .post("/clients/create-job")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .withBody(createJob)
          .expectStatus(201)
          .stores("job_id", "id");
      });

      it("should allow freelancer to bid for job", () => {
        return pactum
          .spec()
          .post("/freelancers/bid-job/$S{job_id}")
          .withHeaders({
            Authorization: "Bearer $S{freelancer_access_tk}",
          })
          .withBody({
            bid_rate: 30,
            bid_coverletter:
              "i would humbly request the opportunity to bid for this job kindly accept ",
          })
          .expectStatus(201)
          .stores("bid_id", "id");
      });
      it("should fail if  freelancer  bids for job", () => {
        return pactum
          .spec()
          .post("/freelancers/bid-job/$S{job_id+=1}")
          .withHeaders({
            Authorization: "Bearer $S{freelancer_access_tk}",
          })
          .withBody({
            bid_rate: 30,
            bid_coverletter:
              "i would humbly request the opportunity to bid for this job kindly accept ",
          })
          .expectStatus(404);
      });
    });

    describe("bids", () => {
      it("should approve bid", () => {
        return pactum
          .spec()
          .post("/clients/approve-bid/$S{bid_id}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .expectStatus(201);
      });
      it("should fail to approve bid", () => {
        return pactum
          .spec()
          .post("/clients/approve-bid/$S{bid_id+=1}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .expectStatus(404);
      });
      it("should get all bids from a specific job", () => {
        return pactum
          .spec()
          .get("/clients/get-bids/$S{job_id}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .expectStatus(200);
      });
    });

    describe("rate and review", () => {
      const rateReviewBody: RateReviewDto = {
        rating: 5,
        review:
          "this is a hardworking and easy to work with person highly recommend",
      };

      it("should not allow client to rate and review freelancer without completing the job", () => {
        return pactum
          .spec()
          .post("/clients/rate-and-review/$S{job_id}/$S{freelancer_id}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .withBody(rateReviewBody)
          .expectStatus(403);
      });

      it("should allow client to complete job", () => {
        return pactum
          .spec()
          .post("/clients/update-completion-status/$S{job_id}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .expectStatus(201);
      });

      it("should allow client to rate and review freelancer", () => {
        return pactum
          .spec()
          .post("/clients/rate-and-review/$S{job_id}/$S{freelancer_id}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .withBody(rateReviewBody)
          .expectStatus(201)
          .stores("rate_review_id", "id");
      });
      it("should not allow client to rate and review freelancer", () => {
        return pactum
          .spec()
          .post("/clients/rate-and-review/$S{job_id+=1}/$S{freelancer_id+=1}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .withBody(rateReviewBody)
          .expectStatus(404);
      });

      it("should allow client to update rate and reviews", () => {
        return pactum
          .spec()
          .put("/clients/update-rate-review/$S{rate_review_id}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .withBody({
            rating: 4.9,
          })
          .expectStatus(200);
      });

      it("should not allow client to update rate and reviews", () => {
        return pactum
          .spec()
          .put("/clients/update-rate-review/$S{rate_review_id+=1}")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .withBody({
            rating: 4.9,
          })
          .expectStatus(404);
      });
    });

    describe("freelancers", () => {
      it("should get freelancers full profile", () => {
        return pactum
          .spec()
          .get("/freelancers/full-profile")
          .withHeaders({
            Authorization: "Bearer $S{freelancer_access_tk}",
          })
          .expectStatus(200);
      });
      it("should fail to get freelancers  profile", () => {
        return pactum
          .spec()
          .get("/freelancers/full-profile")
          .withHeaders({
            Authorization: "Bearer $S{user_access_tk}",
          })
          .expectStatus(409);
      });
      const bioDto: CreateBioDto = {
        title: "Full stack  developer",
        description:
          "i am a full stack developer specializing in blah blah blah and i am great at my job and basically just the best",
        hourly_rate: 25,
      };
      it("create freelancers bio", () => {
        return pactum
          .spec()
          .post("/freelancers/bio")
          .withHeaders({
            Authorization: "Bearer $S{freelancer_access_tk}",
          })
          .withFile(
            join(
              process.cwd(),
              "uploads/images/0f4b60ac-c9df-4f22-a701-18c8223494e4-design-3.png"
            )
          )
          .withBody(bioDto)
          .expectStatus(201)
          .stores("id_of_entity", "id");
      });
      it("should fail to create freelancers bio", () => {
        return pactum
          .spec()
          .post("/freelancers/bio")
          .withHeaders({
            Authorization: "Bearer $S{user_access_token}",
          })
          .withBody(bioDto)
          .expectStatus(401);
      });
      const createExperienceDto: CreateExperienceDto = {
        company: "Anglican Development Services",
        year_from: "2020",
        year_to: "2023",
      };
      it("should create freelancers experience", () => {
        return pactum
          .spec()
          .post("/freelancers/experience")
          .withHeaders({
            Authorization: "Bearer $S{freelancer_access_tk}",
          })
          .withBody(createExperienceDto)
          .expectStatus(201);
      });
      const createEducationDto: CreateEducationDto = {
        school: "Utumishi Academy",
        year_from: "2014",
        year_to: "2018",
      };
      it("should create freelancers education", () => {
        return pactum
          .spec()
          .post("/freelancers/education")
          .withHeaders({
            Authorization: "Bearer $S{freelancer_access_tk}",
          })
          .withBody(createEducationDto)
          .expectStatus(201);
      });
      it("should add  new skills to freelancers", () => {
        const addSkillsDto: AddSkillsDto = {
          skills: [
            {
              skill_id: 1,
            },
            {
              skill_id: 3,
            },
            {
              skill_id: 4,
            },
            {
              skill_id: 19,
            },
            {
              skill_id: 20,
            },
            {
              skill_id: 22,
            },
          ],
        };
        return pactum
          .spec()
          .post("/freelancers/skills")
          .withHeaders({
            Authorization: "Bearer $S{freelancer_access_tk}",
          })
          .withBody(addSkillsDto)
          .expectStatus(201);
      });
      const updateAllProfile: UpdateAllProfileDto = {
        //@ts-ignore
        type: "bio",
        //@ts-ignore
        data: {
          bio_title: "React Graphql Full stack  developer",
        },
      };
      it("should update any part of a freelancers profile", () => {
        return pactum
          .spec()
          .patch("/freelancers/update-any/$S{freelancer_id}/$S{id_of_entity}")
          .withHeaders({
            Authorization: "Bearer $S{freelancer_access_tk}",
          })
          .withBody(updateAllProfile)
          .expectStatus(200);
      });
      it("should not update any part of a freelancers profile", () => {
        return pactum
          .spec()
          .patch(
            "/freelancers/update-any/$S{freelancer_id+=1}/$S{id_of_entity}"
          )
          .withHeaders({
            Authorization: "Bearer $S{freelancer_access_tk}",
          })
          .withBody(updateAllProfile)
          .expectStatus(404);
      });
    });
  });

  describe("Report", () => {
    it("should get Freelancer reports", () => {
      return pactum
        .spec()
        .get("/reports/freelancer-reports")
        .withHeaders({
          Authorization: "Bearer $S{freelancer_access_tk}",
        })
        .expectStatus(200);
    });
    it("should not get Freelancer reports", () => {
      return pactum
        .spec()
        .get("/reports/freelancer-reports")
        .withHeaders({
          Authorization: "Bearer $S{user_access_tk}",
        })
        .expectStatus(409);
    });

    it("should get client reports", () => {
      return pactum
        .spec()
        .get("/reports/client-reports")
        .withHeaders({
          Authorization: "Bearer $S{user_access_tk}",
        })
        .expectStatus(200);
    });

    it("should throw and fail to get client reports", () => {
      return pactum
        .spec()
        .get("/reports/client-reports")
        .withHeaders({
          Authorization: "Bearer $S{freelancer_access_tk}",
        })
        .expectStatus(400);
    });
  });
});

//"client", "freelancer", "admin"
