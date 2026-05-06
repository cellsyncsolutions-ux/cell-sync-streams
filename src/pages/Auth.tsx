import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import logo from "@/assets/logo-mark.png";

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(1, "Name is required").max(100),
});

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/account", { replace: true });
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({ email: form.get("email"), password: form.get("password") });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    navigate("/account");
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
      fullName: form.get("fullName"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: { full_name: parsed.data.fullName },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created!");
    navigate("/account");
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="flex items-center gap-3 mb-8">
        <img src={logo} alt="Cell Sync Solutions" className="h-12 w-12" />
        <span className="font-extrabold text-xl text-primary">CELL SYNC SOLUTIONS</span>
      </Link>

      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-card p-6">
        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="si-email">Email</Label>
                <Input id="si-email" name="email" type="email" required maxLength={255} />
              </div>
              <div>
                <Label htmlFor="si-pw">Password</Label>
                <Input id="si-pw" name="password" type="password" required maxLength={72} />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="su-name">Full Name</Label>
                <Input id="su-name" name="fullName" required maxLength={100} />
              </div>
              <div>
                <Label htmlFor="su-email">Email</Label>
                <Input id="su-email" name="email" type="email" required maxLength={255} />
              </div>
              <div>
                <Label htmlFor="su-pw">Password</Label>
                <Input id="su-pw" name="password" type="password" required minLength={6} maxLength={72} />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={submitting}>
                {submitting ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      <Link to="/" className="text-sm text-muted-foreground hover:text-primary mt-6">← Back to home</Link>
    </main>
  );
};

export default Auth;