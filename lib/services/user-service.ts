import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { formatCurrency } from "@/lib/format";
import type { DashboardStat } from "@/lib/types";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function sanitizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const name = sanitizeText(input.name);
  const email = normalizeEmail(input.email);
  const password = input.password.trim();

  if (!name || !email || !password) {
    throw new Error("Complete your name, email, and password.");
  }

  if (!isValidEmail(email)) {
    throw new Error("Enter a valid email address.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  await logActivity({
    actorUserId: user.id,
    targetUserId: user.id,
    action: "USER_REGISTERED",
    entityType: "User",
    entityId: user.id,
    metadata: { email: user.email },
  });
  await createSession(user.id);

  return user;
}

export async function authenticateUser(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);
  const password = input.password.trim();

  if (!email || !password) {
    throw new Error("Enter your email and password.");
  }

  if (!isValidEmail(email)) {
    throw new Error("Enter a valid email address.");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("Email or password is incorrect.");
  }

  await createSession(user.id);
  await logActivity({
    actorUserId: user.id,
    targetUserId: user.id,
    action: "USER_LOGGED_IN",
    entityType: "Session",
    metadata: { email: user.email },
  });

  return user;
}

export async function updateUserProfile(userId: string, input: { name: string }) {
  const name = sanitizeText(input.name);

  if (!name) {
    throw new Error("Name is required.");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { name },
  });
}

export async function updateUserPassword(userId: string, input: { password: string }) {
  const password = input.password.trim();

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(password, 12) },
  });
}

export async function getUserDashboardData(userId: string) {
  const [proposals, activity] = await Promise.all([
    prisma.proposal.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: { client: true },
    }),
    prisma.activityLog.findMany({
      where: { targetUserId: userId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const acceptedProposals = proposals.filter((proposal) => proposal.status === "ACCEPTED");
  const pendingProposals = proposals.filter((proposal) =>
    ["DRAFT", "SENT", "VIEWED"].includes(proposal.status),
  );
  const revenue = acceptedProposals.reduce((total, proposal) => total + proposal.amount, 0);
  const stats: DashboardStat[] = [
    { label: "Total proposals", value: String(proposals.length), change: "Saved in SQLite", tone: "neutral" },
    { label: "Accepted", value: String(acceptedProposals.length), change: "Closed deals", tone: "positive" },
    { label: "Pending", value: String(pendingProposals.length), change: "Draft, sent, or viewed", tone: "warning" },
    { label: "Revenue", value: formatCurrency(revenue), change: "Accepted proposal value", tone: "positive" },
  ];

  return { proposals, activity, stats };
}

export async function getAdminOverviewData() {
  const [users, proposals, clients, activity] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { proposals: true, clients: true } } },
    }),
    prisma.proposal.findMany({
      orderBy: { updatedAt: "desc" },
      include: { user: true, client: true },
    }),
    prisma.client.count(),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { actorUser: true, targetUser: true },
    }),
  ]);

  const acceptedRevenue = proposals
    .filter((proposal) => proposal.status === "ACCEPTED")
    .reduce((total, proposal) => total + proposal.amount, 0);
  const stats: DashboardStat[] = [
    { label: "Total users", value: String(users.length), change: "All accounts", tone: "neutral" },
    { label: "Total proposals", value: String(proposals.length), change: "Platform-wide", tone: "neutral" },
    { label: "Total clients", value: String(clients), change: "Platform-wide", tone: "neutral" },
    { label: "Accepted revenue", value: formatCurrency(acceptedRevenue), change: "All users", tone: "positive" },
  ];

  return { users, proposals, clients, activity, stats, acceptedRevenue };
}
