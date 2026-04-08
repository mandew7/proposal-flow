"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth";
import { setFlashMessage } from "@/lib/flash";
import { authenticateUser, registerUser } from "@/lib/services/user-service";

export interface AuthActionState {
  message: string;
  tone: "success" | "error";
}

const initialAuthState: AuthActionState = { message: "", tone: "error" };

export async function registerAction(
  _previousState: AuthActionState = initialAuthState,
  formData: FormData,
): Promise<AuthActionState> {
  try {
    await registerUser({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
  } catch (error) {
    return {
      tone: "error",
      message: error instanceof Error ? error.message : "We could not create your account.",
    };
  }

  await setFlashMessage({ tone: "success", message: "Account created. Welcome to ProposalFlow." });
  redirect("/dashboard");
}

export async function loginAction(
  _previousState: AuthActionState = initialAuthState,
  formData: FormData,
): Promise<AuthActionState> {
  try {
    await authenticateUser({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
  } catch (error) {
    return {
      tone: "error",
      message: error instanceof Error ? error.message : "We could not sign you in.",
    };
  }

  await setFlashMessage({ tone: "success", message: "Signed in successfully." });
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  await setFlashMessage({ tone: "success", message: "You have been signed out." });
  redirect("/login");
}
