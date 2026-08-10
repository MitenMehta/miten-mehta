import { useEffect, useState } from "react";
import { Mail, Phone, Linkedin, ExternalLink, CheckCircle2, TrendingUp, Users, Award, Briefcase, Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import mitenPhoto from "@/assets/miten-mehta-photo.jpeg";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Link } from "react-router-dom";
import { MitenAIAvatarChat } from "@/components/MitenAIAvatarChat";

interface LinkedInPost {
  id: string;
  content: string;
  image_url: string | null;
  post_url: string;
  posted_at: string;
}

// EDIT THIS ARRAY to change what shows in the "Latest on LinkedIn" grid.
// Just swap the content/post_url/posted_at for each post — no login or database needed.
const LINKEDIN_POSTS: LinkedInPost[] = [
  {
    id: "1",
    content:
      "Our book is live today. Trust in the Age of Agentic AI Economy is a blueprint for enterprises deploying AI agents without governance — 24 chapters covering the Digital Trust Stack, Industry Language Models, a 90-day implementation roadmap, and contributions from 30+ global enterprise leaders. Co-authored with Nisharg Nargund (Founder, OpenRAG Innovations) and Prof. Suresh Chandra Satapathy.",
    image_url: null,
    post_url: "https://www.linkedin.com/feed/update/urn:li:activity:7477439316642918400/",
    posted_at: "2026-07-08",
  },
  {
    id: "2",
    content:
      "Your AI agent just made a wrong decision. Can you prove what happened? A regulator asks why your system did what it did — you have 30 seconds to answer, not 30 days. That's the standard courts and regulators are beginning to hold enterprises to. Can you answer it?",
    image_url: null,
    post_url: "https://www.linkedin.com/posts/mitenmehta_ugcPost-7482037220049100800-AI39/",
    posted_at: "2026-07-12",
  },
];

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mode, setMode] = useState<"aria" | "orion">("aria");

  // Scroll reveal hooks for each section
  const statsSection = useScrollReveal();
  const overviewSection = useScrollReveal();
  const techSection = useScrollReveal();
  const venturesSection = useScrollReveal();
  const profileSection = useScrollReveal();
  const historySection = useScrollReveal();
  const expertiseSection = useScrollReveal();
  const boardSection = useScrollReveal();
  const thoughtSection = useScrollReveal();
  const linkedinSection = useScrollReveal();
  const contactSection = useScrollReveal();

  const linkedinPosts = LINKEDIN_POSTS;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <span>Miten Mehta</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-semibold border border-accent/30 uppercase tracking-wider">
                {mode === "aria" ? "Aria Mode" : "Orion Mode"}
              </span>
            </Link>
            {/* Desktop Nav & Dual-Mode Persona Switcher */}
            <div className="hidden md:flex items-center gap-4">
              {/* Mode Switcher */}
              <div className="flex bg-muted p-1 rounded-xl border border-border">
                <button
                  onClick={() => setMode("aria")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    mode === "aria"
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  👔 Aria (Executive)
                </button>
                <button
                  onClick={() => setMode("orion")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    mode === "orion"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ⚡ Orion (Technical)
                </button>
              </div>

              <Button variant="ghost" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/articles">Articles</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/community" className="font-semibold text-primary">Community</Link>
              </Button>
            </div>
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-2 flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="ghost" asChild className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                <Link to="/articles">Articles</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                <Link to="/community" className="font-semibold text-primary">Community</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            <div
              className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-elegant flex-shrink-0 transform transition-transform duration-500"
              style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            >
              <img
                src={mitenPhoto}
                alt="Miten Mehta"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-primary-foreground text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                Miten Mehta
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-4 md:mb-6 text-primary-foreground/90 font-medium">
                Chief AI Officer | Sovereign Agentic AI Architect | Ex-Google Cloud
              </p>
              <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 leading-relaxed text-primary-foreground/80">
                $760M+ Capital Formation & P&L Executive | Author & Hon. Professor @ KIIT | Davos WEF Speaker
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 mb-6 md:mb-8 justify-center lg:justify-start">
                <Button
                  variant="secondary"
                  size="default"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg text-sm md:text-base"
                  asChild
                >
                  <a href="https://wa.me/15107175712" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    +1 (510) 717-5712
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  size="default"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg text-sm md:text-base"
                  asChild
                >
                  <a href="https://wa.me/919930078040" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    +91 99300 78040
                  </a>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center lg:justify-start">
                <Button size="default" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-2 border-primary-foreground/50 text-primary-foreground shadow-lg text-sm md:text-base" asChild>
                  <a href="mailto:mitennmehta@gmail.com">
                    <Mail className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    <span className="truncate">mitennmehta@gmail.com</span>
                  </a>
                </Button>
                <Button size="default" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-2 border-primary-foreground/50 text-primary-foreground shadow-lg text-sm md:text-base" asChild>
                  <a href="https://www.linkedin.com/in/mitenmehta/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    LinkedIn Profile
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsSection.ref}
        className={`py-10 md:py-16 bg-secondary transition-all duration-700 ${statsSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
            <Card className="p-3 md:p-6 text-center shadow-card hover:shadow-elegant transition-all">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1 md:mb-2">30+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Years Experience</div>
            </Card>
            <Card className="p-3 md:p-6 text-center shadow-card hover:shadow-elegant transition-all">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1 md:mb-2">$760M+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Capital Raised</div>
            </Card>
            <Card className="p-3 md:p-6 text-center shadow-card hover:shadow-elegant transition-all">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1 md:mb-2">10+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Successful Exits</div>
            </Card>
            <Card className="p-3 md:p-6 text-center shadow-card hover:shadow-elegant transition-all">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1 md:mb-2">3</div>
              <div className="text-xs md:text-sm text-muted-foreground">IPOs Led</div>
            </Card>
            <Card className="p-3 md:p-6 text-center shadow-card hover:shadow-elegant transition-all">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1 md:mb-2">4</div>
              <div className="text-xs md:text-sm text-muted-foreground">Ventures Built</div>
            </Card>
            <Card className="p-3 md:p-6 text-center shadow-card hover:shadow-elegant transition-all">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent mb-1 md:mb-2">30+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Investments</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Executive Overview */}
      <section
        ref={overviewSection.ref}
        className={`py-12 md:py-20 container mx-auto px-4 md:px-6 transition-all duration-700 delay-100 ${overviewSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Executive Overview</h2>

        <Card className="p-4 md:p-8 mb-6 md:mb-8 shadow-card">
          <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">Purpose</h3>
          <p className="text-lg leading-relaxed text-foreground/90">
            Leverage 30+ years of leadership experience, skills, strategic relationships and ecosystem network to build, grow and scale capital efficient, profitable, sustainable and impact driven institutions.
          </p>
          <p className="text-lg leading-relaxed text-foreground/90 mt-4">
            C Suite leader: in high growth companies or operating partner at Private Equity, Venture Capital, Family Offices, applying deep expertise in Generative AI, Agentic AI, Blockchain, Web3, Digital Transformation, and Global Ecosystem building for value creation.
          </p>
        </Card>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <div className="flex items-start gap-3 md:gap-4 mb-4">
              <div className="p-2 md:p-3 bg-accent/10 rounded-lg">
                <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">C-Suite & Leadership</h3>
                <p className="text-foreground/80">
                  30+ years of C-Level and Leadership Experience across Nasdaq-listed, PE/VC-backed, and high-growth ventures with full P&L ownership, GTM scaling, capital strategy, and digital transformation.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <div className="flex items-start gap-3 md:gap-4 mb-4">
              <div className="p-2 md:p-3 bg-accent/10 rounded-lg">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">Capital Raising & Fund Management</h3>
                <p className="text-foreground/80">
                  Raised $760M+ from global investors, including institutional funds, family offices, sovereign wealth funds, pension funds, and banks.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <div className="flex items-start gap-3 md:gap-4 mb-4">
              <div className="p-2 md:p-3 bg-accent/10 rounded-lg">
                <Award className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">M&A, IPOs & Exits</h3>
                <p className="text-foreground/80">
                  Executed 10+ exits, including landmark deals valued at $150M, $500M, and $1.2B. Successfully led 3 IPOs valued at $1B+ each, expertise in deal sourcing, due diligence, valuation, and value creation.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <div className="flex items-start gap-3 md:gap-4 mb-4">
              <div className="p-2 md:p-3 bg-accent/10 rounded-lg">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">Founder & Operator</h3>
                <p className="text-foreground/80">
                  Built and scaled 4 ventures from inception to exit, delivering consistent 30–150% YoY growth across multiple sectors through operating leadership, GTM acceleration, and strategic partnerships.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Technology Differentiator */}
      <section
        ref={techSection.ref}
        className={`py-12 md:py-20 bg-muted transition-all duration-700 delay-150 ${techSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Technology Differentiator</h2>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <Card className="p-4 md:p-8 shadow-card">
              <h3 className="text-base md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-accent flex-shrink-0" />
                Multi-agent orchestration platforms
              </h3>
              <p className="text-foreground/80">
                3M+ autonomous decisions monthly, $50M+ GMV
              </p>
            </Card>

            <Card className="p-4 md:p-8 shadow-card">
              <h3 className="text-base md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-accent flex-shrink-0" />
                Blockchain-enabled DPI platforms
              </h3>
              <p className="text-sm md:text-base text-foreground/80">
                40% cost reduction, $20M+ processed
              </p>
            </Card>

            <Card className="p-4 md:p-8 shadow-card">
              <h3 className="text-base md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-accent flex-shrink-0" />
                Tokenized systems
              </h3>
              <p className="text-sm md:text-base text-foreground/80">
                2x creator retention, 3x transaction velocity
              </p>
            </Card>

            <Card className="p-4 md:p-8 shadow-card">
              <h3 className="text-base md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-accent flex-shrink-0" />
                Domain-specific language models
              </h3>
              <p className="text-sm md:text-base text-foreground/80">
                Across creators/orange economy, travel, fintech, healthcare, retail/CPG
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Ventures & Investments */}
      <section
        ref={venturesSection.ref}
        className={`py-12 md:py-20 container mx-auto px-4 md:px-6 transition-all duration-700 delay-200 ${venturesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Ventures Built</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-16">
          <Card className="p-4 md:p-6 shadow-card hover:shadow-elegant transition-all">
            <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">eComLive</h3>
            <p className="text-sm text-accent font-semibold mb-2">Acquired by Infospace</p>
            <p className="text-foreground/80">E-commerce platform</p>
          </Card>

          <Card className="p-4 md:p-6 shadow-card hover:shadow-elegant transition-all">
            <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">MoConDi</h3>
            <p className="text-xs md:text-sm text-accent font-semibold mb-1 md:mb-2">Acquired by MobileMedia</p>
            <p className="text-sm md:text-base text-foreground/80">Mobile content delivery</p>
          </Card>

          <Card className="p-4 md:p-6 shadow-card hover:shadow-elegant transition-all">
            <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">Spinta</h3>
            <p className="text-xs md:text-sm text-accent font-semibold mb-1 md:mb-2">Private Exit</p>
            <p className="text-sm md:text-base text-foreground/80">Global Accelerator</p>
          </Card>

          <Card className="p-4 md:p-6 shadow-card hover:shadow-elegant transition-all">
            <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">KloudData</h3>
            <p className="text-xs md:text-sm text-accent font-semibold mb-1 md:mb-2">Successful Exit</p>
            <p className="text-sm md:text-base text-foreground/80">Cloud data platform</p>
          </Card>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Board & Advisory Roles</h2>
        <p className="text-center text-sm md:text-lg text-foreground/80 mb-6 md:mb-8 px-2">
          Active board member/advisor with 30+ investments across SaaS, fintech, payments, crypto, and creator economy ventures
        </p>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {['PlaySpan (Visa)', 'JPM (Good)', 'Hubilo', 'EthX', 'NuPay', 'MondeeONE', 'CopperWire', 'Koinbasket'].map((company) => (
            <Card key={company} className="px-3 py-2 md:px-6 md:py-3 shadow-card hover:shadow-elegant transition-all">
              <p className="font-semibold text-sm md:text-base">{company}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Professional Profile */}
      <section
        ref={profileSection.ref}
        className={`py-12 md:py-20 bg-secondary transition-all duration-700 ${profileSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Professional Profile</h2>

          <Card className="p-4 md:p-8 shadow-card mb-4 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">C-Suite Leader</h3>
            <p className="text-lg leading-relaxed text-foreground/90">
              Miten is a customer-centric, revenue-focused, and results-driven business leader with a profound bias for action and a commitment to achieving outcomes.
            </p>
          </Card>

          <Card className="p-4 md:p-8 shadow-card mb-4 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">P&L Champion</h3>
            <p className="text-sm md:text-lg leading-relaxed text-foreground/90">
              With over 25 years of experience, Miten is a strategic leader adept at steering repeatable, scalable, profitable, and non-linear growth across diverse sectors, including TravelTech, FinTech, EdTech, RetailTech, and Digital Native segments.
            </p>
          </Card>

          <Card className="p-4 md:p-8 shadow-card mb-4 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">AI Architect</h3>
            <p className="text-sm md:text-lg leading-relaxed text-foreground/90">
              Positioned at the forefront of technological innovation, Miten leverages cutting-edge solutions like Open AI/GPT-4 and Google Gemini/Vertex. His expertise lies in integrating intelligence into digital user, supplier, and customer journeys.
            </p>
          </Card>

          <Card className="p-4 md:p-8 shadow-card mb-4 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">Revenue Catalyst</h3>
            <p className="text-lg leading-relaxed text-foreground/90">
              As a seasoned marketing and GTM virtuoso, Miten propels Cloud/SaaS/PaaS adoption, driving user acquisition, retention, and growth. His approach is characterized by ROI-led business cases and strategic utilization of partner ecosystems for exponential value.
            </p>
          </Card>

          <Card className="p-4 md:p-8 shadow-card">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">Team Alchemist</h3>
            <p className="text-sm md:text-lg leading-relaxed text-foreground/90">
              Miten is a talent magnet, specializing in assembling high-performing, cross-functional dream teams. He is renowned for fostering innovation and retaining top-tier performers.
            </p>
          </Card>
        </div>
      </section>

      {/* Professional History */}
      <section
        ref={historySection.ref}
        className={`py-12 md:py-20 container mx-auto px-4 md:px-6 transition-all duration-700 delay-100 ${historySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Professional History</h2>

        <div className="space-y-4 md:space-y-8">
          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <div className="flex items-start gap-3 md:gap-4 mb-4">
              <div className="p-2 md:p-3 bg-accent/10 rounded-lg">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Mondee (Nasdaq – MOND)</h3>
                <p className="text-sm md:text-base text-accent font-semibold mb-2">Chief of AI Solutions, GTM & Partnerships | July 2023 - Present</p>
                <p className="text-foreground/80 mb-4">
                  Miten serves as the CMO and Chief of AI Solutions at Mondee, a global travel tech leader. In this role, he leads the transformation of Mondee's user digital journeys through strategic GTM programs, including APN (Abhi Partner Network) and MAPS (Mondee AI Platform Services), to drive company growth.
                </p>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Transformed customer journey and digital experience by embedding AI-driven personalization, marketplace solutions, and platform-first strategies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Defined and executed data-driven marketing frameworks that accelerated user acquisition, engagement, and monetization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Architected and deployed AI-led GTM strategies, leveraging LLMs (OpenAI GPT-4, Azure, Google Gemini/Vertex, AWS Bedrock)</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-accent/10 rounded-lg">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Fractal</h3>
                <p className="text-sm md:text-base text-accent font-semibold mb-2">Global Alliance Officer</p>
                <p className="text-foreground/80 mb-4">
                  At Fractal, Miten served as the Global Alliance Officer, steering hyperscaler and AI strategy and cloud partnerships. He successfully built an ecosystem for joint GTM, solutions, and new customer and revenue pipelines.
                </p>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Built ecosystem for joint GTM, solutions, and new customer and revenue pipelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>Expanded and grew AI partner solutions and stacks to customize ML models for solving customer challenges</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-accent/10 rounded-lg">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">Google Cloud</h3>
                <p className="text-sm md:text-base text-accent font-semibold mb-2">Strategic Leadership</p>
                <p className="text-foreground/80 mb-4">
                  During his tenure at Google Cloud, Miten led strategic customer and partner accounts, establishing the Customer Adoption Platform (CAP). This initiative rewarded and recognized real-time contributions from ecosystem communities, driving user engagement and product adoption.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-accent/10 rounded-lg">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">CleverTap</h3>
                <p className="text-sm md:text-base text-accent font-semibold mb-2">Chief Alliance Officer</p>
                <p className="text-foreground/80 mb-4">
                  As the Chief Alliance Officer at CleverTap, Miten rolled out CAN (CleverTap Alliance Network) globally, significantly accelerating revenue growth non-linearly through Solution Partners and contributing compounding strategic value through deep integrations with Technology partners.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-accent/10 rounded-lg">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">KloudData</h3>
                <p className="text-sm md:text-base text-accent font-semibold mb-2">Global Head of Strategic Alliance</p>
                <p className="text-foreground/80 mb-4">
                  At KloudData, as the Global Head of Strategic Alliance, Miten created and launched the CARE (Customer Acquisition Retention & Engagement) framework. This involved a 'Co-Innovate, Co-Market & Co-Sell' field interlock GTM model to penetrate underserved market segments, verticals, and regions.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Expertise Areas */}
      <section
        ref={expertiseSection.ref}
        className={`py-12 md:py-20 bg-muted transition-all duration-700 delay-150 ${expertiseSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Expertise Areas</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {[
              'Agentic AI & Autonomous Systems',
              'Multi-Agent Orchestration',
              'Domain Language Models',
              'Web3 & DeFi',
              'Smart Contracts',
              'Tokenomics',
              'TGEs & SAFT Structures',
              'Digital Public Infrastructure',
              'Go-to-Market Strategy',
              'Strategic Partnerships',
              'Ecosystem Building',
              'Platform Economics',
              'Capital Raising',
              'IPO Leadership',
              'M&A Execution',
              'Regulatory Navigation',
              'P&L Management',
              'Digital Transformation'
            ].map((expertise) => (
              <Card key={expertise} className="p-3 md:p-4 shadow-card hover:shadow-elegant transition-all text-center">
                <p className="font-semibold text-xs md:text-base text-foreground/90">{expertise}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Board Expertise */}
      <section
        ref={boardSection.ref}
        className={`py-12 md:py-20 container mx-auto px-4 md:px-6 transition-all duration-700 delay-200 ${boardSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">Strategic Board Expertise</h2>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-primary">Growth Strategy</h3>
            <p className="text-foreground/80">
              Built 100+ partner ecosystems, validated PMF in 40%+ YoY growth markets
            </p>
          </Card>

          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-primary">Capital Markets</h3>
            <p className="text-sm md:text-base text-foreground/80">
              IPO preparation, M&A execution, institutional investor relations, crypto fundraising
            </p>
          </Card>

          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-primary">Technology</h3>
            <p className="text-sm md:text-base text-foreground/80">
              Agentic AI deployment, Web3/blockchain architecture, smart contracts, tokenomics
            </p>
          </Card>

          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-primary">Regulatory</h3>
            <p className="text-sm md:text-base text-foreground/80">
              15+ jurisdictions including financial services and digital asset frameworks
            </p>
          </Card>

          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-primary">Ecosystem Building</h3>
            <p className="text-sm md:text-base text-foreground/80">
              Developer communities (25K+), DAO-like governance models
            </p>
          </Card>

          <Card className="p-4 md:p-8 shadow-card hover:shadow-elegant transition-all">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-primary">P&L, GTM & Growth</h3>
            <p className="text-sm md:text-base text-foreground/80">
              PMF (Product–Market Fit), GTM strategy & partnerships, hypergrowth scaling & ecosystem, revenue & monetization, structuring, and operational excellence
            </p>
          </Card>
        </div>
      </section>

      {/* Latest on LinkedIn */}
      {linkedinPosts.length > 0 && (
        <section
          ref={linkedinSection.ref}
          className={`py-12 md:py-20 container mx-auto px-4 md:px-6 transition-all duration-700 ${linkedinSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Latest on LinkedIn</h2>
              <p className="text-muted-foreground text-sm md:text-base">Recent posts and updates</p>
            </div>
            <Button variant="outline" asChild className="self-start md:self-auto">
              <a href="https://www.linkedin.com/in/mitenmehta/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4" />
                View Full Profile
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {linkedinPosts.map((post) => (
              <a
                key={post.id}
                href={post.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Card className="h-full flex flex-col overflow-hidden shadow-elegant hover:shadow-lg transition-shadow duration-300">
                  {post.image_url && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={post.image_url}
                        alt="LinkedIn post"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-sm text-foreground/90 line-clamp-4 flex-1">{post.content}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.posted_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Books, IP & Academic Leadership */}
      <section
        ref={thoughtSection.ref}
        className={`py-12 md:py-20 bg-gradient-hero transition-all duration-700 ${thoughtSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-primary-foreground">Books, IP & Academic Leadership</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 md:mb-12">
            Pioneering research in Enterprise Agentic AI, Digital Trust Frameworks, and Startup Economics.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left mb-12">
            <Card className="p-6 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground shadow-elegant hover:bg-primary-foreground/15 transition-all">
              <span className="text-xs uppercase tracking-wider text-accent font-semibold">Latest Publication (2026)</span>
              <h3 className="text-xl font-bold mt-2 mb-3">Trust in the Age of Agentic AI Economy</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                A 24-chapter blueprint for enterprise AI deployment without governance friction. Co-authored with Nisharg Nargund & Prof. Suresh Chandra Satapathy.
              </p>
              <div className="text-xs font-medium text-accent">24 Chapters • Digital Trust Stack • 90-Day Roadmap</div>
            </Card>

            <Card className="p-6 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground shadow-elegant hover:bg-primary-foreground/15 transition-all">
              <span className="text-xs uppercase tracking-wider text-accent font-semibold">Published Book</span>
              <h3 className="text-xl font-bold mt-2 mb-3">Rama in the Startup Exile</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Published by Notion Press & available on Amazon. A narrative guide on navigating startup adversity, capital formation, and resilience.
              </p>
              <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-semibold text-accent hover:underline">
                Available on Amazon <ExternalLink className="ml-1 w-3 h-3" />
              </a>
            </Card>

            <Card className="p-6 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground shadow-elegant hover:bg-primary-foreground/15 transition-all">
              <span className="text-xs uppercase tracking-wider text-accent font-semibold">Academic & Global Keynotes</span>
              <h3 className="text-xl font-bold mt-2 mb-3">Hon. Professor @ KIIT & Davos Speaker</h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Honorary Professor at Kalinga Institute of Industrial Technology (KIIT). Keynote speaker at Davos World Economic Forum (WEF), Forbes Tech & MIT Connection Science.
              </p>
              <div className="text-xs font-medium text-accent">KIIT University • WEF Davos • Forbes Tech</div>
            </Card>
          </div>

          {/* GitHub Ecosystem Showcase */}
          <div className="max-w-4xl mx-auto p-6 md:p-8 bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl text-primary-foreground text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Sovereign Open Source Architecture</h3>
            <p className="text-sm md:text-base text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Architect of OrchestrAI OS — an open-source, federated multi-agent AI operating system for Zero-Trust enterprise security.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" size="default" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md" asChild>
                <a href="https://github.com/MitenMehta/miten-mehta" target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" /> Personal GitHub Repo
                </a>
              </Button>
              <Button variant="outline" size="default" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/20" asChild>
                <a href="https://github.com/orchestrai-os/orchestrai" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> OrchestrAI OS Ecosystem
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section
        ref={contactSection.ref}
        className={`py-12 md:py-20 container mx-auto px-4 md:px-6 transition-all duration-700 delay-100 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <Card className="p-6 md:p-12 shadow-elegant text-center bg-gradient-accent">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-accent-foreground">Get In Touch</h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-accent-foreground/90">
            Let's discuss how we can drive growth and create value together
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4">
            <Button
              size="default"
              variant="secondary"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg text-sm md:text-base"
              asChild
            >
              <a href="https://wa.me/15107175712" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                WhatsApp US
              </a>
            </Button>
            <Button
              size="default"
              variant="secondary"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg text-sm md:text-base"
              asChild
            >
              <a href="https://wa.me/919930078040" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                WhatsApp India
              </a>
            </Button>
            <Button
              size="default"
              variant="secondary"
              className="bg-card hover:bg-card/90 text-card-foreground border-2 border-primary/20 shadow-lg text-sm md:text-base"
              asChild
            >
              <a href="mailto:mitennmehta@gmail.com">
                <Mail className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Email
              </a>
            </Button>
            <Button
              size="default"
              variant="secondary"
              className="bg-primary hover:bg-primary/80 text-primary-foreground shadow-lg text-sm md:text-base"
              asChild
            >
              <a href="https://www.linkedin.com/in/mitenmehta/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                LinkedIn
              </a>
            </Button>
          </div>
        </Card>
      </section>

      {/* Interactive AI Knowledge Avatar */}
      <MitenAIAvatarChat />

      {/* Footer */}
      <footer className="py-6 md:py-8 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-xs md:text-sm opacity-80">
            © 2025 Miten Mehta. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Glass Dome Telemetry Status Bar (IDE Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 text-slate-300 text-[11px] px-3 py-1.5 flex items-center justify-between font-mono backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            99.999% SLA ACTIVE
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            SSOT: <strong className="text-slate-200">237 OS LAYERS VERIFIED</strong> (`orchestrai-postgres`)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-slate-400">
            SECURITY: <strong className="text-emerald-400">ZERO SECRET LEAKAGE (LAW-50)</strong>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-accent font-bold">
            EPOCH: CVO-SIGNED-v1.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;