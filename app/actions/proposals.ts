"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export interface ProposalActionState {
  message: string;
  tone: "success" | "error";
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readAmount(formData: FormData) {
  const amount = Number(readString(formData, "amount"));
  return Number.isFinite(amount) ? Math.round(amount) : 0;
}

function readStatus(formData: FormData) {
  const status = (readString(formData, "submitStatus") || readString(formData, "status")).toUpperCase();

  if (["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED"].includes(status)) {
    return status as "DRAFT" | "SENT" | "VIEWED" | "ACCEPTED" | "REJECTED";
  }

  return "DRAFT";
}

async function validateClient(userId: string, clientId: string) {
  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      userId,
    },
  });

  return client;
}

export async function createProposalAction(
  _previousState: ProposalActionState,
  formData: FormData,
): Promise<ProposalActionState> {
  const user = await requireUser();
  const title = readString(formData, "title");
  const clientId = readString(formData, "clientId");
  const description = readString(formData, "description");
  const amount = readAmount(formData);
  const status = readStatus(formData);
  const dueDate = readString(formData, "dueDate");

  if (!title || !clientId || !description || !dueDate) {
    return { tone: "error", message: "Complete the title, client, description, amount, and due date." };
  }

  if (amount <= 0) {
    return { tone: "error", message: "Amount must be a positive number." };
  }

  const client = await validateClient(user.id, clientId);

  if (!client) {
    return { tone: "error", message: "Choose a valid client for this proposal." };
  }

  const proposal = await prisma.proposal.create({
    data: {
      userId: user.id,
      clientId: client.id,
      title,
      description,
      amount,
      status,
      dueDate: new Date(`${dueDate}T00:00:00`),
    },
  });

  await logActivity({
    actorUserId: user.id,
    targetUserId: user.id,
    action: "PROPOSAL_CREATED",
    entityType: "Proposal",
    entityId: proposal.id,
    metadata: { title: proposal.title, status: proposal.status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/proposals");
  redirect("/dashboard/proposals?message=Proposal%20created");
}

export async function updateProposalAction(
  _previousState: ProposalActionState,
  formData: FormData,
): Promise<ProposalActionState> {
  const user = await requireUser();
  const id = readString(formData, "id");
  const title = readString(formData, "title");
  const clientId = readString(formData, "clientId");
  const description = readString(formData, "description");
  const amount = readAmount(formData);
  const status = readStatus(formData);
  const dueDate = readString(formData, "dueDate");

  if (!id || !title || !clientId || !description || !dueDate) {
    return { tone: "error", message: "Complete the title, client, description, amount, and due date." };
  }

  if (amount <= 0) {
    return { tone: "error", message: "Amount must be a positive number." };
  }

  const [proposal, client] = await Promise.all([
    prisma.proposal.findFirst({ where: { id, userId: user.id } }),
    validateClient(user.id, clientId),
  ]);

  if (!proposal) {
    return { tone: "error", message: "Proposal not found." };
  }

  if (!client) {
    return { tone: "error", message: "Choose a valid client for this proposal." };
  }

  const updatedProposal = await prisma.proposal.update({
    where: { id },
    data: {
      clientId: client.id,
      title,
      description,
      amount,
      status,
      dueDate: new Date(`${dueDate}T00:00:00`),
    },
  });

  await logActivity({
    actorUserId: user.id,
    targetUserId: user.id,
    action: "PROPOSAL_UPDATED",
    entityType: "Proposal",
    entityId: updatedProposal.id,
    metadata: { title: updatedProposal.title, status: updatedProposal.status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/proposals");
  redirect("/dashboard/proposals?message=Proposal%20updated");
}

export async function changeProposalStatusAction(formData: FormData) {
  const user = await requireUser();
  const id = readString(formData, "id");
  const status = readStatus(formData);

  const proposal = await prisma.proposal.findFirst({ where: { id, userId: user.id } });

  if (!proposal) {
    redirect("/dashboard/proposals?message=Proposal%20not%20found");
  }

  await prisma.proposal.update({
    where: { id },
    data: { status },
  });

  await logActivity({
    actorUserId: user.id,
    targetUserId: user.id,
    action: "PROPOSAL_STATUS_CHANGED",
    entityType: "Proposal",
    entityId: id,
    metadata: { title: proposal.title, status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/proposals");
  redirect("/dashboard/proposals?message=Status%20updated");
}

export async function deleteProposalAction(formData: FormData) {
  const user = await requireUser();
  const id = readString(formData, "id");
  const proposal = await prisma.proposal.findFirst({ where: { id, userId: user.id } });

  if (!proposal) {
    redirect("/dashboard/proposals?message=Proposal%20not%20found");
  }

  await prisma.proposal.delete({ where: { id } });
  await logActivity({
    actorUserId: user.id,
    targetUserId: user.id,
    action: "PROPOSAL_DELETED",
    entityType: "Proposal",
    entityId: id,
    metadata: { title: proposal.title },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/proposals");
  redirect("/dashboard/proposals?message=Proposal%20deleted");
}
