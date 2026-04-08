import { GuestOnly } from "@/components/auth/auth-guard";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <GuestOnly>
      <LoginForm />
    </GuestOnly>
  );
}
