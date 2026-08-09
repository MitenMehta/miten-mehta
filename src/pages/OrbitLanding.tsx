import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Phone, Mail, MapPin } from "lucide-react";
import orbitLogo from "@/assets/Orbit_New_Logo.png";
import MSCIRankingsTable from "@/components/MSCIRankingsTable";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
});

export default function OrbitLanding() {
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Parse UTM parameters from URL
  const [utmParams] = useState({
    utm_source: searchParams.get("utm_source") || undefined,
    utm_medium: searchParams.get("utm_medium") || undefined,
    utm_campaign: searchParams.get("utm_campaign") || undefined,
    utm_content: searchParams.get("utm_content") || undefined,
    utm_term: searchParams.get("utm_term") || undefined,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.from("leads").insert({
        name: values.name,
        email: values.email,
        phone: values.phone,
        source: "landing_page",
        landing_page: "Orbit Financial Services",
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_content: utmParams.utm_content,
        utm_term: utmParams.utm_term,
        status: "new",
      });

      if (error) throw error;

      // Redirect to thank you page
      navigate("/orbit-thank-you");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(215,50%,12%)] via-[hsl(215,45%,18%)] to-[hsl(215,50%,12%)]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[hsl(215,50%,12%)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img src={orbitLogo} alt="Orbit Financial Services" className="h-16 md:h-20" />
            <div className="flex items-center gap-4 text-sm text-white/80">
              <a href="tel:02242259999" className="hidden md:flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="h-4 w-4" />
                022 4225 9999
              </a>
              <a href="mailto:sheetal@orbitfin.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">sheetal@orbitfin.com</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Content */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Simplified Solutions for <span className="text-[hsl(25,95%,53%)]">Investing in Indian Equities</span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                  In an era of constantly changing and volatile financial markets, investors need a qualified, trained, 
                  and unbiased professional to help them achieve their short-term and long-term financial goals.
                </p>
              </div>

              {/* Key Points */}
              <div className="grid gap-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[hsl(25,95%,53%)] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Two Decades of Experience</h3>
                    <p className="text-white/70">More than 20 years of trusted financial expertise with technology-driven investment solutions</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[hsl(25,95%,53%)] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">GIFT City Advantage</h3>
                    <p className="text-white/70">Invest in AIF, PMS, and Mutual Funds (Fund of Funds) with simplified tax structure through GIFT City</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[hsl(25,95%,53%)] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Diversification & Compounded Returns</h3>
                    <p className="text-white/70">Build wealth through strategic diversification and harness the power of compounding for long-term growth</p>
                  </div>
                </div>
              </div>

              {/* Vision & Mission */}
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-[hsl(25,95%,53%)] mb-3">Vision</h3>
                  <p className="text-white/80 text-sm">
                    To be a respectful financial solutions provider excelling in customer life.
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-[hsl(25,95%,53%)] mb-3">Mission</h3>
                  <p className="text-white/80 text-sm">
                    To help clients improve their lives by minimizing their risk susceptibility and making their investment journey rewarding.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Lead Form */}
            <div className="lg:sticky lg:top-8">
              <Card className="border-white/20 bg-white/95 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl text-[hsl(215,50%,12%)]">
                    {submitted ? "Thank You!" : "Start Your Investment Journey"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {submitted 
                      ? "We've received your information and will contact you shortly." 
                      : "Fill in your details and our expert will reach out to you"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Our team will contact you within 24 hours to discuss your financial goals.
                      </p>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your.email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="+91 XXXXX XXXXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white h-12 text-lg font-semibold"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? "Submitting..." : "Get Started"}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* MSCI Rankings Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Why <span className="text-[hsl(25,95%,53%)]">Indian Equities</span>?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              India has consistently ranked among the top-performing equity markets globally, 
              delivering exceptional long-term returns in dollar terms.
            </p>
          </div>
          <MSCIRankingsTable />
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-[hsl(25,95%,53%)] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">India Office</h3>
                <p className="text-sm text-white/70">
                  B-103, Dev prayag, Mathuradas Road,<br />
                  Opp Pragati Mitra Kandivali (W),<br />
                  Mumbai – 400067
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-[hsl(25,95%,53%)] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">US Office</h3>
                <p className="text-sm text-white/70">
                  Satsang - 2312, Mondello Path,<br />
                  Leander, Texas 78641
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-[hsl(25,95%,53%)] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm text-white/70">
                  022 4225 9999 (100 lines)<br />
                  +91 98202 22657
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-[hsl(25,95%,53%)] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-sm text-white/70">
                  sheetal@orbitfin.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-[hsl(215,50%,10%)]">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <p className="text-xs text-white/60 leading-relaxed max-w-5xl mx-auto">
              <strong>Risk Factors:</strong> Investments in securities are subject to market risks. Read all related documents carefully before investing. 
              Investment products do not assure or guarantee any returns. Past performance may or may not be sustained in future. 
              There is no guarantee that the investment objective of any suggested product shall be achieved. All existing and prospective investors are advised 
              to check and evaluate the fees, charges, and other cost structures applicable at the time of making the investment before finalizing any investment decision.
            </p>
            <p className="text-xs text-white/60">
              <strong>AMFI Registered Mutual Fund Distributor</strong> | ARN-40107 | Date of initial Registration: 13/05/2006 | Current validity: 12/06/2026
            </p>
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Orbit Financial Services. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}