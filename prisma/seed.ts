import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import * as argon2 from "argon2";

const skills = [
  {
    skill_name: "Node Js",
  },
  {
    skill_name: "People",
  },
  {
    skill_name: "Next Js",
  },
  {
    skill_name: "React Js",
  },
  {
    skill_name: "Object-oriented programming (OOP) ",
  },
  {
    skill_name: "SQL",
  },
  {
    skill_name: "Web development",
  },
  {
    skill_name: "HTML",
  },
  {
    skill_name: "CSS",
  },
  {
    skill_name: "Javascript ",
  },
  {
    skill_name: "PHP",
  },
  {
    skill_name: "Ruby",
  },
  {
    skill_name: "ASP ",
  },
  {
    skill_name: "writing ",
  },
  {
    skill_name: "Full stack development  ",
  },
  {
    skill_name: "Frontend development  ",
  },
  {
    skill_name: "Backend development",
  },

  {
    skill_name: "MySQL",
  },
  {
    skill_name: "PostgreSQL",
  },
  {
    skill_name: "MongoDb",
  },
  {
    skill_name: "Python",
  },
  {
    skill_name: "GraphQl",
  },
  {
    skill_name: "REST",
  },
];

async function main() {
  await prisma.skill.createMany({
    data: skills,
  });

  const hash = await argon2.hash("Michael1234", {
    hashLength: 12,
  });

  await prisma.user.create({
    data: {
      user_email: "michael.mambo.22@gmail.com",
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
        create: {},
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
