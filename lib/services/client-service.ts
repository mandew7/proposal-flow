import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

const activeStatuses = new Set(["DRAFT", "SENT", "VIEWED"]);
const closedStatuses = new Set(["ACCEPTED", "REJECTED"]);

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

export async function getClientDetailsForUser(userId: string, clientId: string) {
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      userId,
    },
    include: {
      proposals: {
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!client) {
    return null;
  }

  const now = new Date();
  const activeDeals = client.proposals.filter((proposal) => activeStatuses.has(proposal.status));
  const upcomingDeals = client.proposals.filter((proposal) => proposal.dueDate > now);
  const closedDeals = client.proposals.filter((proposal) => closedStatuses.has(proposal.status));
  const totalProposalValue = client.proposals.reduce((total, proposal) => total + proposal.amount, 0);
  const acceptedProposalValue = client.proposals
    .filter((proposal) => proposal.status === "ACCEPTED")
    .reduce((total, proposal) => total + proposal.amount, 0);

  return {
    client,
    stats: {
      totalProposals: client.proposals.length,
      totalProposalValue,
      acceptedProposalValue,
      activeDeals: activeDeals.length,
      upcomingDeals: upcomingDeals.length,
      closedDeals: closedDeals.length,
    },
    groupedProposals: {
      activeDeals,
      upcomingDeals,
      closedDeals,
    },
  };
}
