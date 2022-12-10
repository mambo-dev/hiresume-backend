import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/createuser.dto";
import * as argon2 from "argon2";

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async findOne(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        user_email: username,
      },
    });
  }

  async create(createUserdto: CreateUserDto) {
    const { password, email, country, role, firstName, lastName } =
      createUserdto;

    const hash = await argon2.hash(password, {
      hashLength: 12,
    });

    const userExists = await this.findOne(email);

    if (userExists) {
      throw new ConflictException("user already exists");
    }

    const user = await this.prismaService.user.create({
      data: {
        user_email: email,
        user_country: country,
        user_password: hash,
        user_role: role,
        profile: {
          create: {
            profile_firstname: firstName,
            profile_secondname: lastName,
          },
        },
      },
    });

    assignUserRole(user.user_role, this.prismaService);
    async function assignUserRole(role: string, prisma: any) {
      switch (role) {
        case "admin":
          await prisma.admin.create({
            data: {
              admin_user_id: user.id,
            },
          });
          break;
        case "freelancer":
          await prisma.freelancer.create({
            data: {
              freelancer_user_id: user.id,
            },
          });
          break;
        case "client":
          await prisma.client.create({
            data: {
              client_user_id: user.id,
            },
          });
          break;
        default:
          throw new Error("could not create role");
      }
    }

    const { user_password, ...returnUser } = user;

    return returnUser;
  }

  async findProfile(username: string) {
    return this.prismaService.user
      .findUnique({
        where: {
          user_email: username,
        },
      })
      .profile();
  }
}
