import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

export const allowedProposalStatuses = ["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED"] as const;
export type ProposalStatusValue = (typeof allowedProposalStatuses)[number];
const publicResponseStatuses = ["ACCEPTED", "REJECTED"] as const;
type PublicResponseStatusValue = (typeof publicResponseStatuses)[number];

interface ProposalWithRelations {
  id: string;
  userId: string;
  clientId: string | null;
  publicId: string;
  title: string;
  description: string;
  amount: number;
  status: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  client: {
    id: string;
    name: string;
    company: string;
    email: string;
  } | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

function sanitizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function readStatus(value: string) {
  const status = value.trim().toUpperCase();
  return allowedProposalStatuses.includes(status as ProposalStatusValue)
    ? (status as ProposalStatusValue)
    : "DRAFT";
}

function readPublicResponseStatus(value: string) {
  const status = value.trim().toUpperCase();
  return publicResponseStatuses.includes(status as PublicResponseStatusValue)
    ? (status as PublicResponseStatusValue)
    : null;
}

function readDueDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Provide a valid due date.");
  }

  return date;
}

async function findOwnedClient(userId: string, clientId: string) {
  return prisma.client.findFirst({
    where: {
      id: clientId,
      userId,
    },
  });
}

async function findOwnedProposal(userId: string, proposalId: string) {
  return (await prisma.proposal.findFirst({
    where: {
      id: proposalId,
      userId,
    },
    include: {
      client: true,
      user: true,
    },
  })) as ProposalWithRelations | null;
}

export async function createProposal(
  userId: string,
  input: {
    title: string;
    clientId: string;
    description: string;
    amount: number;
    status: string;
    dueDate: string;
  },
) {
  const title = sanitizeText(input.title);
  const clientId = input.clientId.trim();
  const description = sanitizeText(input.description);
  const amount = Math.round(input.amount);
  const status = readStatus(input.status);
  const dueDate = readDueDate(input.dueDate);

  if (!title || !clientId || !description || !input.dueDate) {
    throw new Error("Complete the title, client, description, amount, and due date.");
  }

  if (amount <= 0) {
    throw new Error("Amount must be a positive number.");
  }

  const client = await findOwnedClient(userId, clientId);

  if (!client) {
    throw new Error("Choose a valid client for this proposal.");
  }

  const proposal = await prisma.proposal.create({
    data: {
      userId,
      clientId: client.id,
      title,
      description,
      amount,
      status,
      dueDate,
    },
  });

  await logActivity({
    actorUserId: userId,
    targetUserId: userId,
    action: "PROPOSAL_CREATED",
    entityType: "Proposal",
    entityId: proposal.id,
    metadata: { title: proposal.title, status: proposal.status },
  });

  return proposal;
}

export async function updateProposal(
  userId: string,
  input: {
    id: string;
    title: string;
    clientId: string;
    description: string;
    amount: number;
    status: string;
    dueDate: string;
  },
) {
  const proposal = await prisma.proposal.findFirst({ where: { id: input.id, userId } });

  if (!proposal) {
    throw new Error("Proposal not found.");
  }

  const client = await findOwnedClient(userId, input.clientId);

  if (!client) {
    throw new Error("Choose a valid client for this proposal.");
  }

  const updatedProposal = await prisma.proposal.update({
    where: { id: input.id },
    data: {
      clientId: client.id,
      title: sanitizeText(input.title),
      description: sanitizeText(input.description),
      amount: Math.round(input.amount),
      status: readStatus(input.status),
      dueDate: readDueDate(input.dueDate),
    },
  });

  await logActivity({
    actorUserId: userId,
    targetUserId: userId,
    action: "PROPOSAL_UPDATED",
    entityType: "Proposal",
    entityId: updatedProposal.id,
    metadata: { title: updatedProposal.title, status: updatedProposal.status },
  });

  return updatedProposal;
}

export async function changeProposalStatus(userId: string, proposalId: string, statusValue: string) {
  const proposal = await prisma.proposal.findFirst({ where: { id: proposalId, userId } });

  if (!proposal) {
    throw new Error("Proposal not found.");
  }

  const status = readStatus(statusValue);
  const updatedProposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: { status },
  });

  await logActivity({
    actorUserId: userId,
    targetUserId: userId,
    action: "PROPOSAL_STATUS_CHANGED",
    entityType: "Proposal",
    entityId: updatedProposal.id,
    metadata: { title: proposal.title, status },
  });

  return updatedProposal;
}

export async function deleteProposal(userId: string, proposalId: string) {
  const proposal = await prisma.proposal.findFirst({ where: { id: proposalId, userId } });

  if (!proposal) {
    throw new Error("Proposal not found.");
  }

  await prisma.proposal.delete({ where: { id: proposalId } });
  await logActivity({
    actorUserId: userId,
    targetUserId: userId,
    action: "PROPOSAL_DELETED",
    entityType: "Proposal",
    entityId: proposalId,
    metadata: { title: proposal.title },
  });

  return proposal;
}

export async function listProposalsForUser(userId: string) {
  return (await prisma.proposal.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { client: true },
  })) as Array<
    Omit<ProposalWithRelations, "user" | "publicId"> & {
      client: ProposalWithRelations["client"];
    }
  >;
}

export async function listProposalOptionsForUser(userId: string) {
  return prisma.client.findMany({
    where: { userId },
    orderBy: { company: "asc" },
  });
}

export async function getProposalById(userId: string, proposalId: string) {
  const proposal = await findOwnedProposal(userId, proposalId);

  if (!proposal) {
    return null;
  }

  const activity = await prisma.activityLog.findMany({
    where: {
      targetUserId: userId,
      entityType: "Proposal",
      entityId: proposal.id,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return { proposal, activity };
}

export async function getPublicProposal(publicId: string) {
  return (await prisma.proposal.findFirst({
    where: { publicId } as never,
    include: {
      client: true,
      user: true,
    },
  })) as ProposalWithRelations | null;
}

export async function registerPublicProposalView(publicId: string) {
  const proposal = await getPublicProposal(publicId);

  if (!proposal) {
    return null;
  }

  if (proposal.status === "SENT" || proposal.status === "DRAFT") {
    const viewedProposal = await prisma.proposal.update({
      where: { id: proposal.id },
      data: { status: "VIEWED" },
      include: {
        client: true,
        user: true,
      },
    });

    await logActivity({
      targetUserId: proposal.userId,
      action: "PROPOSAL_VIEWED",
      entityType: "Proposal",
      entityId: proposal.id,
      metadata: { title: proposal.title, status: "VIEWED" },
    });

    return viewedProposal as ProposalWithRelations;
  }

  return proposal;
}

export async function respondToPublicProposal(publicId: string, statusValue: string) {
  const status = readPublicResponseStatus(statusValue);

  if (!status) {
    throw new Error("Choose a valid response.");
  }

  const proposal = await getPublicProposal(publicId);

  if (!proposal) {
    throw new Error("Proposal not found.");
  }

  if (proposal.status === status) {
    return proposal;
  }

  if (publicResponseStatuses.includes(proposal.status as PublicResponseStatusValue)) {
    throw new Error("This proposal has already been finalized.");
  }

  const updatedProposal = await prisma.proposal.update({
    where: { id: proposal.id },
    data: { status },
    include: {
      client: true,
      user: true,
    },
  });

  await logActivity({
    targetUserId: proposal.userId,
    action: status === "ACCEPTED" ? "PROPOSAL_ACCEPTED_PUBLIC" : "PROPOSAL_REJECTED_PUBLIC",
    entityType: "Proposal",
    entityId: proposal.id,
    metadata: { title: proposal.title, status },
  });

  return updatedProposal as ProposalWithRelations;
}
