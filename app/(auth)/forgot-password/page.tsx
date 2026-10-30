import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export const metadata = {
  title: "Reset Password",
  description: "Request a secure password reset link for your UniCareer Community account.",
};

export default function ForgotPasswordPage() {
  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
          <KeyRound className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Reset your password
        </CardTitle>
        <CardDescription>
          Enter the university or verified email address associated with your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Registered Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@university.edu"
                className="pl-9"
                required
                autoComplete="email"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              We will send a one-time cryptographic reset token valid for 30 minutes.
            </p>
          </div>

          <Button type="submit" className="w-full gap-2 mt-2">
            <span>Send Recovery Email</span>
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return to member sign in</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
