import Link from "next/link";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export const metadata = {
  title: "Create Verified Account",
  description: "Join your university career network as a student, alumnus, faculty member, or corporate partner.",
};

export default function RegisterPage() {
  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create verified account
        </CardTitle>
        <CardDescription>
          Access gated opportunities, alumni mentorship, and campus career referrals
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="membershipType">Institutional Role</Label>
            <Select defaultValue="STUDENT">
              <SelectTrigger id="membershipType" className="w-full">
                <SelectValue placeholder="Select your university relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">Current Student (Enrolled)</SelectItem>
                <SelectItem value="ALUMNI">University Alumnus / Alumna</SelectItem>
                <SelectItem value="FACULTY">Faculty Member / Academic Advisor</SelectItem>
                <SelectItem value="STAFF">University Career Staff</SelectItem>
                <SelectItem value="EMPLOYER">Corporate Recruiter / Employer Partner</SelectItem>
                <SelectItem value="EXTERNAL_CONNECTION">Verified External Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Jane Doe"
                className="pl-9"
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Institutional or Work Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane.doe@university.edu"
                className="pl-9"
                required
                autoComplete="email"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Students and alumni should use official university domain addresses for automated verification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  className="pl-9"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••••••"
                  className="pl-9"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="terms" className="mt-0.5" required />
            <Label
              htmlFor="terms"
              className="text-xs font-normal text-muted-foreground leading-snug cursor-pointer"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline font-semibold">
                Terms of Service
              </Link>{" "}
              and acknowledge the{" "}
              <Link href="/privacy" className="text-primary hover:underline font-semibold">
                Privacy Policy
              </Link>
              .
            </Label>
          </div>

          <Button type="submit" className="w-full gap-2 mt-2">
            <span>Submit Verification Request</span>
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
        <div>
          Already have a verified account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
