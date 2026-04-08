"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export interface SettingsActionState {
  message: string;
  tone: "success" | "error";
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateProfileAction(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const user = await requireUser();
  const name = readString(formData, "name");

  if (!name) {
    return { tone: "error", message: "Name is required." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name },
  });

  revalidatePath("/dashboard/settings");
  return { tone: "success", message: "Profile updated." };
}

export async function updatePasswordAction(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const user = await requireUser();
  const password = readString(formData, "password");

  if (password.length < 8) {
    return { tone: "error", message: "Password must be at least 8 characters." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(password, 12) },
  });

  return { tone: "success", message: "Password updated." };
}
