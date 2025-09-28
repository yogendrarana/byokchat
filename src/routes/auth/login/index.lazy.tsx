import { z } from "zod";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Google from "@/components/icons/google";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/auth-client";

export const Route = createLazyFileRoute("/auth/login/")({
  component: RouteComponent
});

interface FormValues {
  email: string;
  password: string;
}

const defaultValues: FormValues = {
  email: "",
  password: ""
};

function RouteComponent() {
  const router = useRouter();

  const {
    state: { isSubmitting },
    handleSubmit,
    Field,
    reset
  } = useForm({
    defaultValues,
    validators: {
      onSubmit: z.object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" })
      })
    },
    onSubmit: async ({ value }) => {
      const toastId = toast("Logging in");

      try {
        await authClient.signIn.email(
          { email: value.email, password: value.password, callbackURL: "/" },
          {
            onRequest() {
              toast("Signing up...", {
                description: "Please wait while we sign you up.",
                id: toastId
              });
            },
            onSuccess() {
              reset();

              toast.success("Sign up successful!", {
                description: "You have successfully signed up."
              });

              router.navigate({ to: "/" });
            },
            onError(context) {
              toast.error("Sign up failed.", {
                description: context.error.message,
                id: toastId
              });

            }
          }
        );
      } catch (err: any) {
        toast.message("Something went wrong.", {
          description: err.message || "Your sign in request failed. Please try again."
        });
      }
    }
  });

  return (
    <div className="space-y-4">
      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Field
          name="email"
          children={(field) => (
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="email"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isSubmitting}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors &&
                field.state.meta.errors.map((err, i) =>
                  err ? (
                    <p key={i} className="text-red-500 text-xs">
                      {typeof err === "string" ? err : err.message}
                    </p>
                  ) : null
                )}
            </div>
          )}
        />

        <Field
          name="password"
          children={(field) => (
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                placeholder="password"
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isSubmitting}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors &&
                field.state.meta.errors.map((err, i) =>
                  err ? (
                    <p key={i} className="text-red-500 text-xs">
                      {typeof err === "string" ? err : err.message}
                    </p>
                  ) : null
                )}
            </div>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn("w-full cursor-pointer", "transition-all duration-300")}
        >
          {isSubmitting ? <LoaderIcon size={14} className="animate-spin mr-2" /> : null}
          Sign in with email
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full bg-accent"
        onClick={() => console.log("Google sign in")}
        disabled={isSubmitting}
      >
        <Google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}
