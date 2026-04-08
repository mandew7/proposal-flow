"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export interface ClientActionState {
  message: string;
  tone: "success" | "error";
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createClientAction(
  _previousState: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const user = await requireUser();
  const name = readString(formData, "name");
  const company = readString(formData, "company");
  const email = readString(formData, "email").toLowerCase();

  if (!name || !company || !email) {
    return { tone: "error", message: "Complete the client name, company, and email." };
  }

  if (!isValidEmail(email)) {
    return { tone: "error", message: "Enter a valid client email address." };
  }

  const client = await prisma.client.create({
    data: {
      userId: user.id,
      name,
      company,
      email,
    },
  });

  await logActivity({
    actorUserId: user.id,
    targetUserId: user.id,
    action: "CLIENT_CREATED",
    entityType: "Client",
    entityId: client.id,
    metadata: { company: client.company, email: client.email },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/clients");

  return { tone: "success", message: "Client created." };
}
