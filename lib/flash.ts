import { cookies } from "next/headers";

const flashCookieName = "proposalflow_flash";

export interface FlashMessage {
  tone: "success" | "error";
  message: string;
}

export async function setFlashMessage(flash: FlashMessage) {
  const cookieStore = await cookies();
  cookieStore.set(flashCookieName, JSON.stringify(flash), {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10,
  });
}

export async function getFlashMessage() {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(flashCookieName)?.value;

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as FlashMessage;
  } catch {
    return null;
  }
}

export async function clearFlashMessage() {
  const cookieStore = await cookies();
  cookieStore.delete(flashCookieName);
}
