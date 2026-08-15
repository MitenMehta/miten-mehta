import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";

const onboardingSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    headline: z.string().min(2, "Headline must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function Onboarding() {
    const { user, isOnboarded } = useAuth();
    const navigate = useNavigate();

    const form = useForm<OnboardingFormValues>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            full_name: "",
            headline: "",
            email: "",
            phone_number: "",
        },
    });

    useEffect(() => {
        if (user) {
            // Pre-fill form with available data
            form.setValue("email", user.email || "");
            form.setValue("full_name", user.user_metadata?.full_name || "");
            form.setValue("headline", user.user_metadata?.headline || "");

            // If user is already onboarded (e.g. manually navigated here), redirect
            if (isOnboarded) {
                navigate("/community");
            }
        }
    }, [user, isOnboarded, navigate, form]);

    const onSubmit = async (data: OnboardingFormValues) => {
        if (!user) return;

        try {
            // 1. Update public profile
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    full_name: data.full_name,
                    headline: data.headline,
                    is_onboarded: true,
                    updated_at: new Date().toISOString(),
                })
                .eq("user_id", user.id);

            if (profileError) throw profileError;

            // 2. Insert/Update private contact info
            const { error: contactsError } = await supabase
                .from("profile_contacts")
                .upsert({
                    user_id: user.id,
                    email: data.email,
                    phone_number: data.phone_number,
                    updated_at: new Date().toISOString(),
                });

            if (contactsError) throw contactsError;

            toast.success("Profile updated successfully!");
            // Force a reload or wait for AuthProvider to pick up changes? 
            // Ideally AuthProvider listener picks it up or we can manual refresh. 
            // For now, simple navigation might work if AuthState updates quickly, 
            // but is_onboarded in useAuth is fetched on session change or load.
            // We might need to window.location.reload() to force re-fetch or expose a refresh function.

            window.location.href = "/community";

        } catch (error: unknown) {
            console.error("Onboarding error:", error);
            toast.error(getErrorMessage(error, "Failed to update profile"));
        }
    };

    return (
        <div className="container max-w-2xl mx-auto py-20 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to the Inner Circle</CardTitle>
                    <CardDescription>
                        Please complete your profile to join the community. This information helps us verify your identity.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="headline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Professional Headline</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Founder at TechCo | AI Enthusiast" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Your current role or short bio.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Private Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This will be hidden from other members until you connect.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Private Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="+1 234 567 8900" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This will be hidden from other members until you connect.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Complete Setup
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
