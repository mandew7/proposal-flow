import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

function sanitizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createClient(userId: string, input: { name: string; company: string; email: string }) {
  const name = sanitizeText(input.name);
  const company = sanitizeText(input.company);
  const email = normalizeEmail(input.email);

  if (!name || !company || !email) {
    throw new Error("Complete the client name, company, and email.");
  }

  if (!isValidEmail(email)) {
    throw new Error("Enter a valid client email address.");
  }

  const client = await prisma.client.create({
    data: {
      userId,
      name,
      company,
      email,
    },
  });

  await logActivity({
    actorUserId: userId,
    targetUserId: userId,
    action: "CLIENT_CREATED",
    entityType: "Client",
    entityId: client.id,
    metadata: { company: client.company, email: client.email },
  });

  return client;
}

export async function listClientsForUser(userId: string) {
  return prisma.client.findMany({
    where: { userId },
    orderBy: { company: "asc" },
    include: { proposals: true },
  });
}
