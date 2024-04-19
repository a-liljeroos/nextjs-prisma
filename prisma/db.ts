import prisma from "@prisma/prismaClient";

class Database {
  async insertUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string | null;
    password: string;
  }) {
    try {
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: password,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByName(name: string) {
    try {
      const user = await prisma.user.findMany({
        where: {
          name: name,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}

export const db = new Database();
