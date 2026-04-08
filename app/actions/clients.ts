"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/services/client-service";

export interface ClientActionState {
  message: string;
  tone: "success" | "error";
}

export async function createClientAction(
  _previousState: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const user = await requireUser();

  try {
    await createClient(user.id, {
      name: String(formData.get("name") ?? ""),
      company: String(formData.get("company") ?? ""),
      email: String(formData.get("email") ?? ""),
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/clients");

    return { tone: "success", message: "Client created." };
  } catch (error) {
    return {
      tone: "error",
      message: error instanceof Error ? error.message : "We could not create that client.",
    };
  }
}
