import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@demo.com" },
    update: {},
    create: {
      email: "demo@demo.com",
      name: "Demo Player",
      passwordHash,
      wallet: {
        create: {
          balance: 50,
          transactions: {
            create: {
              amount: 50,
              type: "SEED",
              description: "Starting balance",
            },
          },
        },
      },
    },
  });
  console.log("Seeded user:", user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
