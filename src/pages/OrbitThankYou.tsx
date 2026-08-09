import { useEffect } from "react";
import { CheckCircle2, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import orbitLogo from "@/assets/Orbit_New_Logo.png";

export default function OrbitThankYou() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

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

      {/* Thank You Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Success Card */}
            <Card className="border-white/20 bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  {/* Success Icon */}
                  <div className="flex justify-center">
                    <div className="rounded-full bg-green-100 p-6">
                      <CheckCircle2 className="h-16 w-16 text-green-600" />
                    </div>
                  </div>

                  {/* Main Message */}
                  <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-[hsl(215,50%,12%)]">
                      Thank You for Your Interest!
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      We've received your information and our expert financial advisors will reach out to you shortly.
                    </p>
                  </div>

                  {/* What Happens Next */}
                  <div className="bg-[hsl(215,50%,12%)] text-white rounded-lg p-6 space-y-4 text-left">
                    <h2 className="text-xl font-semibold mb-4 text-center">What Happens Next?</h2>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(25,95%,53%)] flex items-center justify-center font-bold">
                          1
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Review Your Information</h3>
                          <p className="text-sm text-white/80">
                            Our team will carefully review your details to understand your financial goals.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(25,95%,53%)] flex items-center justify-center font-bold">
                          2
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Expert Consultation</h3>
                          <p className="text-sm text-white/80">
                            One of our qualified advisors will contact you within 24 hours to discuss your investment journey.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(25,95%,53%)] flex items-center justify-center font-bold">
                          3
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Personalized Plan</h3>
                          <p className="text-sm text-white/80">
                            We'll create a customized investment strategy tailored to your short-term and long-term financial wishes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Benefits Reminder */}
                  <div className="grid sm:grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-[hsl(25,95%,53%)] mb-1">20+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-[hsl(25,95%,53%)] mb-1">GIFT City</div>
                      <div className="text-sm text-muted-foreground">Tax Advantage</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-[hsl(25,95%,53%)] mb-1">24hrs</div>
                      <div className="text-sm text-muted-foreground">Response Time</div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-center">
                      <Button
                        asChild
                        size="lg"
                        className="bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white"
                      >
                        <a href="tel:02242259999">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Us Now
                        </a>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Need immediate assistance? Feel free to call us directly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="mt-8 text-center">
              <a 
                href="https://orbitfin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                Visit our website to learn more
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-white max-w-5xl mx-auto">
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