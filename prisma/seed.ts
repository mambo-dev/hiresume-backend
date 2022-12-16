import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
