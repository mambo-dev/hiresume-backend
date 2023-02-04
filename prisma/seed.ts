import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import * as argon2 from "argon2";

function generateRandomCode(resetOrVerify: string) {
  return `${resetOrVerify}-${Math.floor(Math.random() * 100000)}`;
}

async function main() {
  const hash = await argon2.hash("Michael1234", {
    hashLength: 12,
  });

  await prisma.user.create({
    data: {
      user_email: "mambo.michael.22@gmail.com",
      user_country: "Kenya",
      user_password: hash,
      user_role: "freelancer",
      profile: {
        create: {
          profile_firstname: "Michael",
          profile_secondname: "Mambo",
        },
      },
      Freelancer: {
        create: {
          freelancer_Bio: {
            create: {
              bio_image_url: "just random",
              bio_description: "I am an awesome freelancer",
              bio_title: "Full Stack react developer",
              bio_hourly_rate: 25,
            },
          },
          freelancer_education: {
            create: {
              education_school: "St Pauls University",
              education_year_from: new Date(2014),
              education_year_to: new Date(2021),
            },
          },
          freelancer_experience: {
            create: {
              experience_position: "Sneior engineer",
              experience_tag: "full_time",
              experience_company: "Anglican Development Services",
              experience_year_from: new Date(2021),
              experience_year_to: new Date(2024),
            },
          },
        },
      },
      Account: {
        create: {
          account_password_reset: generateRandomCode("ver"),
          account_verification_code: generateRandomCode("res"),
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      user_email: "mambodev@gmail.com",
      user_country: "Kenya",
      user_password: hash,
      user_role: "client",
      profile: {
        create: {
          profile_firstname: "Michael",
          profile_secondname: "Mambo",
        },
      },
      Client: {
        create: {},
      },
    },
  });

  await prisma.user.create({
    data: {
      user_email: "remael99@gmail.com",
      user_country: "Kenya",
      user_password: hash,
      user_role: "admin",
      profile: {
        create: {
          profile_firstname: "Michael",
          profile_secondname: "Mambo",
        },
      },
      Admin: {
        create: {},
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
