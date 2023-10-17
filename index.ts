import { PrismaClient } from "@prisma/client";

async function main() {
  const prismaClient = new PrismaClient();
  const users = await prismaClient.user.findMany();
  console.log("users", users);
}
main();
