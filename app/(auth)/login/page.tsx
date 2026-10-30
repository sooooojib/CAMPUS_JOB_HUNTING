import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export const metadata = {
  title: "Member Sign In",
  description: "Sign in to access your university career opportunities, applications, and community.",
};

export default function LoginPage() {
  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>
          Sign in using your institutional email or registered credentials
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">University Email</Label>
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
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••••"
                className="pl-9"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox id="remember" />
            <Label
              htmlFor="remember"
              className="text-xs font-normal text-muted-foreground cursor-pointer"
            >
              Remember this device for 30 days
            </Label>
          </div>

          <Button type="submit" className="w-full gap-2 mt-2">
            <span>Sign In to Dashboard</span>
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
        <div>
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Create verified account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
