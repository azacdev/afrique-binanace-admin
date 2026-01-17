"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { FullTextCyanTextIcon } from "@/components/icons";

import { signUp, useSession } from "@/lib/auth-client";
import { validateInvitation, useInvitation } from "@/lib/actions/signup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [invitationEmail, setInvitationEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidatingToken(false);
        return;
      }

      try {
        const result = await validateInvitation(token);

        if (result.valid && result.email) {
          setTokenValid(true);
          setInvitationEmail(result.email);
          setValue("email", result.email);
        } else {
          toast.error(result.error || "Invalid invitation link");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        toast.error("Failed to validate invitation");
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token, setValue]);

  // Redirect if already authenticated
  if (session) {
    router.push("/dashboard");
    return null;
  }

  // Show error if no token or invalid token
  if (!validatingToken && (!token || !tokenValid)) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-[#155E63] to-[#0f4a4e] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center items-center mb-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#155E63]">
                Invalid Invitation
              </CardTitle>
              <CardDescription className="text-gray-600">
                This invitation link is invalid or has expired. Please contact
                an administrator for a new invitation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button className="w-full bg-[#155E63] hover:bg-[#0f4a4e] text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: SignUpForm) => {
    setLoading(true);
    try {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/dashboard",
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to create account");
      } else {
        // Mark invitation as used
        if (token) {
          await useInvitation(token);
        }

        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign up exception:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-[#155E63] to-[#0f4a4e] flex items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Validating invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-[#155E63] to-[#0f4a4e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#155E63] hover:text-[#0f4a4e] mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
            <div className="flex justify-center items-center">
              <FullTextCyanTextIcon className="h-auto" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#155E63]">
              Create Admin Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Complete your admin account setup for {invitationEmail}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldSet className="gap-6">
                <FieldGroup>
                  <Field data-invalid={!!errors.name}>
                    <FieldLabel className="text-[#155E63]">
                      Full Name
                    </FieldLabel>
                    <Input
                      placeholder="John Doe"
                      className="border-gray-300 focus:border-[#155E63] focus:ring-[#155E63]"
                      {...register("name")}
                    />
                    <FieldError>{errors.name?.message}</FieldError>
                  </Field>

                  <Field data-invalid={!!errors.email}>
                    <FieldLabel className="text-[#155E63]">
                      Email Address
                    </FieldLabel>
                    <Input
                      type="email"
                      disabled
                      className="border-gray-300 bg-gray-50 text-gray-500"
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

                  <Field data-invalid={!!errors.confirmPassword}>
                    <FieldLabel className="text-[#155E63]">
                      Confirm Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="border-gray-300 focus:border-[#155E63] focus:ring-[#155E63] pr-10"
                        {...register("confirmPassword")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <FieldError>{errors.confirmPassword?.message}</FieldError>
                  </Field>
                </FieldGroup>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#155E63] hover:bg-[#0f4a4e] text-white py-2.5"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </FieldSet>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
