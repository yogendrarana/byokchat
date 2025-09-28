import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Google from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { registerUser } from "../-lib/functions";
import { RegisterUserSchema } from "@/lib/validation/auth";

export const Route = createLazyFileRoute("/auth/register/")({
  component: ComponentPage
});

function ComponentPage() {
  const router = useRouter();

  const {
    state: { isSubmitting },
    handleSubmit,
    reset,
    Field
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },

    validators: {
      onSubmit: RegisterUserSchema
    },
    onSubmit: async ({ value }) => {
      const toastId = toast("Signing up");

      try {
        const response = await registerUser({ data: value });
        if (!response.success) {
          toast.error("Sign up failed.", {
            description: response.message || "An error occurred during registration.",
            id: toastId
          });
          return;
        }

        reset();
        // refetch();
        router.navigate({ to: "/auth/login" });
        toast.success("Success!", {
          description: "You have successfully signed up. Please login now.",
          id: toastId
        });
      } catch (err: any) {
        toast.error("Something went wrong.", {
          description: err.message || "Your sign-up request failed. Please try again.",
          id: toastId
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
          name="name"
          children={(field) => (
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                placeholder="name"
                type="text"
                autoCapitalize="none"
                autoComplete="name"
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
                    <p key={i} className="text-xs text-red-600">
                      {typeof err === "string" ? err : err.message}
                    </p>
                  ) : null
                )}{" "}
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
                    <p key={i} className="text-xs text-red-600">
                      {typeof err === "string" ? err : err.message}
                    </p>
                  ) : null
                )}{" "}
            </div>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn("w-full cursor-pointer ", "transition-all duration-300")}
        >
          {isSubmitting ? <LoaderIcon size={14} className="animate-spin mr-2" /> : null}
          Sign up with email
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
