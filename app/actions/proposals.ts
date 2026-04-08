"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { setFlashMessage } from "@/lib/flash";
import {
  changeProposalStatus,
  createProposal,
  deleteProposal,
  respondToPublicProposal,
  updateProposal,
} from "@/lib/services/proposal-service";

export interface ProposalActionState {
  message: string;
  tone: "success" | "error";
}

export async function createProposalAction(
  _previousState: ProposalActionState,
  formData: FormData,
): Promise<ProposalActionState> {
  const user = await requireUser();

  try {
    await createProposal(user.id, {
      title: String(formData.get("title") ?? ""),
      clientId: String(formData.get("clientId") ?? ""),
      description: String(formData.get("description") ?? ""),
      amount: Number(formData.get("amount") ?? 0),
      status: String(formData.get("submitStatus") ?? formData.get("status") ?? ""),
      dueDate: String(formData.get("dueDate") ?? ""),
    });
  } catch (error) {
    return {
      tone: "error",
      message: error instanceof Error ? error.message : "We could not create that proposal.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/proposals");
  await setFlashMessage({ tone: "success", message: "Proposal created." });
  redirect("/dashboard/proposals");
}

export async function updateProposalAction(
  _previousState: ProposalActionState,
  formData: FormData,
): Promise<ProposalActionState> {
  const user = await requireUser();

  try {
    await updateProposal(user.id, {
      id: String(formData.get("id") ?? ""),
      title: String(formData.get("title") ?? ""),
      clientId: String(formData.get("clientId") ?? ""),
      description: String(formData.get("description") ?? ""),
      amount: Number(formData.get("amount") ?? 0),
      status: String(formData.get("submitStatus") ?? formData.get("status") ?? ""),
      dueDate: String(formData.get("dueDate") ?? ""),
    });
  } catch (error) {
    return {
      tone: "error",
      message: error instanceof Error ? error.message : "We could not update that proposal.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/proposals");
  await setFlashMessage({ tone: "success", message: "Proposal updated." });
  redirect("/dashboard/proposals");
}

export async function changeProposalStatusAction(formData: FormData) {
  const user = await requireUser();

  try {
    await changeProposalStatus(
      user.id,
      String(formData.get("id") ?? ""),
      String(formData.get("status") ?? ""),
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/proposals");
    await setFlashMessage({ tone: "success", message: "Proposal status updated." });
  } catch (error) {
    await setFlashMessage({
      tone: "error",
      message: error instanceof Error ? error.message : "We could not update the proposal status.",
    });
  }

  redirect("/dashboard/proposals");
}

export async function deleteProposalAction(formData: FormData) {
  const user = await requireUser();

  try {
    await deleteProposal(user.id, String(formData.get("id") ?? ""));
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/proposals");
    await setFlashMessage({ tone: "success", message: "Proposal deleted." });
  } catch (error) {
    await setFlashMessage({
      tone: "error",
      message: error instanceof Error ? error.message : "We could not delete that proposal.",
    });
  }

  redirect("/dashboard/proposals");
}

export async function respondToPublicProposalAction(
  _previousState: ProposalActionState,
  formData: FormData,
): Promise<ProposalActionState> {
  const publicId = String(formData.get("publicId") ?? "");

  try {
    await respondToPublicProposal(publicId, String(formData.get("status") ?? ""));
  } catch (error) {
    return {
      tone: "error",
      message: error instanceof Error ? error.message : "We could not save that response.",
    };
  }

  revalidatePath(`/p/${publicId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/proposals");

  return {
    tone: "success",
    message: "Your response has been recorded.",
  };
}
