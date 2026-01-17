"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { FullTextCyanTextIcon } from "@/components/icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "@/lib/auth-client";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  if (session) {
    router.push("/dashboard");
    return null;
  }

  const onSubmit = async (data: SignInForm) => {
    setLoading(true);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to sign in");
      } else {
        toast.success("Signed in successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign in exception:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-[#155E63] to-[#0f4a4e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center items-center mb-4">
              <FullTextCyanTextIcon className="h-auto" />
            </div>

            <CardTitle className="text-2xl font-rg-standard-book font-semibold text-[#155E63]">
              Afrique Bitcoin Admin
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to manage the conference portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldSet className="gap-6">
                <FieldGroup>
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel className="text-[#155E63]">
                      Email Address
                    </FieldLabel>
                    <Input
                      type="email"
                      placeholder="admin@afriquebitcoin.com"
                      className="border-gray-300 focus:border-[#155E63] focus:ring-[#155E63]"
                      {...register("email")}
                    />
                    <FieldError>{errors.email?.message}</FieldError>
                  </Field>

                  <Field data-invalid={!!errors.password}>
                    <FieldLabel className="text-[#155E63]">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="border-gray-300 focus:border-[#155E63] focus:ring-[#155E63] pr-10"
                        {...register("password")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <FieldError>{errors.password?.message}</FieldError>
                  </Field>
                </FieldGroup>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#155E63] hover:bg-[#0f4a4e] text-white py-2.5"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </FieldSet>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
