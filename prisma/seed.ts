import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@proposalflow.local";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-please";
  const name = process.env.ADMIN_NAME ?? "ProposalFlow Admin";

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      name,
      passwordHash,
      role: "ADMIN",
    },
    create: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.activityLog.create({
    data: {
      actorUserId: admin.id,
      targetUserId: admin.id,
      action: "ADMIN_SEEDED",
      entityType: "User",
      entityId: admin.id,
      metadata: JSON.stringify({ email: admin.email }),
    },
  });

  console.log(`Admin ready: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
