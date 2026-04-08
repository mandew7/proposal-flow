"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export interface AuthActionState {
  message: string;
  tone: "success" | "error";
}

const initialAuthState: AuthActionState = {
  message: "",
  tone: "error",
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(email: string) {
  return email.toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function registerAction(
  _previousState: AuthActionState = initialAuthState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = readString(formData, "name");
  const email = normalizeEmail(readString(formData, "email"));
  const password = readString(formData, "password");

  if (!name || !email || !password) {
    return { tone: "error", message: "Complete your name, email, and password." };
  }

  if (!isValidEmail(email)) {
    return { tone: "error", message: "Enter a valid email address." };
  }

  if (password.length < 8) {
    return { tone: "error", message: "Password must be at least 8 characters." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { tone: "error", message: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
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

  redirect("/dashboard");
}

export async function loginAction(
  _previousState: AuthActionState = initialAuthState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = normalizeEmail(readString(formData, "email"));
  const password = readString(formData, "password");

  if (!email || !password) {
    return { tone: "error", message: "Enter your email and password." };
  }

  if (!isValidEmail(email)) {
    return { tone: "error", message: "Enter a valid email address." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { tone: "error", message: "Email or password is incorrect." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return { tone: "error", message: "Email or password is incorrect." };
  }

  await createSession(user.id);
  await logActivity({
    actorUserId: user.id,
    targetUserId: user.id,
    action: "USER_LOGGED_IN",
    entityType: "Session",
    metadata: { email: user.email },
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
