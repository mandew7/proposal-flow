"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { updateUserPassword, updateUserProfile } from "@/lib/services/user-service";

export interface SettingsActionState {
  message: string;
  tone: "success" | "error";
}

export async function updateProfileAction(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const user = await requireUser();

  try {
    await updateUserProfile(user.id, { name: String(formData.get("name") ?? "") });
    revalidatePath("/dashboard/settings");
    return { tone: "success", message: "Profile updated." };
  } catch (error) {
    return {
      tone: "error",
      message: error instanceof Error ? error.message : "We could not update your profile.",
    };
  }
}

export async function updatePasswordAction(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const user = await requireUser();

  try {
    await updateUserPassword(user.id, { password: String(formData.get("password") ?? "") });
    return { tone: "success", message: "Password updated." };
  } catch (error) {
    return {
      tone: "error",
      message: error instanceof Error ? error.message : "We could not update your password.",
    };
  }
}
