import { GuestOnly } from "@/components/auth/auth-guard";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <GuestOnly>
      <RegisterForm />
    </GuestOnly>
  );
}
