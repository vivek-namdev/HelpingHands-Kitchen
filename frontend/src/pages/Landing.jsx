import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  HeartHandshake,
  Leaf,
  MapPin,
  Menu,
  Package,
  PackageOpen,
  Recycle,
  ShieldCheck,
  Sparkles,
  Truck,
  UsersRound,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

const impactStats = [
  {
    value: 2400,
    suffix: "+",
    label: "Meals rescued",
    color: "green",
  },
  {
    value: 180,
    suffix: "+",
    label: "Active donors",
    color: "blue",
  },
  {
    value: 45,
    suffix: "+",
    label: "NGO partners",
    color: "green",
  },
];

const demoDonations = [
  {
    id: "DON600001",
    category: "Cooked Meals",
    quantity: "24 KG",
    city: "Noida",
    x: "25%",
    y: "33%",
  },
  {
    id: "DON600002",
    category: "Fruits",
    quantity: "18 KG",
    city: "Delhi",
    x: "61%",
    y: "25%",
  },
  {
    id: "DON600003",
    category: "Bakery",
    quantity: "12 KG",
    city: "Gurugram",
    x: "71%",
    y: "61%",
  },
  {
    id: "DON600004",
    category: "Vegetables",
    quantity: "31 KG",
    city: "Ghaziabad",
    x: "37%",
    y: "70%",
  },
];

const testimonials = [
  {
    quote:
      "HelpingHands Kitchen gave us a simple way to make our surplus food useful instead of letting it go to waste.",
    name: "Community Donor",
    role: "Food Partner",
    color: "green",
  },
  {
    quote:
      "Finding donations is much easier when everything is organized in one place and pickup status is visible.",
    name: "NGO Partner",
    role: "Community Organization",
    color: "blue",
  },
  {
    quote:
      "The platform helps us see the complete journey from donation to successful delivery.",
    name: "HelpingHands Kitchen Admin",
    role: "Platform Operations",
    color: "purple",
  },
];

const faqs = [
  {
    question: "What is HelpingHands Kitchen?",
    answer:
      "HelpingHands Kitchen is a food-rescue platform that connects surplus food donors with NGOs that can redistribute that food to communities.",
  },
  {
    question: "Who can donate food?",
    answer:
      "Restaurants, hotels, event organizers, businesses, and other registered donors can create food donations.",
  },
  {
    question: "How do NGOs claim food?",
    answer:
      "Registered NGOs can view available donations, claim suitable food, and coordinate pickup and delivery.",
  },
  {
    question: "Can I track my donation?",
    answer:
      "Yes. HelpingHands Kitchen tracks the donation and claim workflow so participants can see how the process progresses.",
  },
  {
    question: "Is HelpingHands Kitchen free to use?",
    answer:
      "The platform is designed to connect donors and NGOs through a simple shared workflow. Account and feature availability depend on your HelpingHands Kitchen deployment.",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "List food",
    description:
      "Add surplus food, quantity, location, availability, and pickup instructions.",
    icon: PackageOpen,
    color: "green",
  },
  {
    number: "02",
    title: "NGO claims",
    description:
      "An NGO finds a suitable donation and claims it for their community.",
    icon: CheckCircle2,
    color: "blue",
  },
  {
    number: "03",
    title: "Pickup coordinated",
    description:
      "Pickup information is shared and the claim moves through its workflow.",
    icon: Truck,
    color: "green",
  },
  {
    number: "04",
    title: "Delivered",
    description:
      "The food reaches people who need it and the impact is completed.",
    icon: Heart,
    color: "blue",
  },
];

const roleContent = {
  donor: {
    label: "For donors",
    title: "Turn surplus food into something meaningful.",
    description:
      "List food in minutes, add the pickup location, and keep track of what happens after your donation.",
    icon: HeartHandshake,
    accent: "green",
    points: [
      "Create donations quickly",
      "Add exact pickup locations",
      "Track donation status",
      "See your impact",
    ],
    action: "Register as donor",
    route: "/register/donor",
  },
  ngo: {
    label: "For NGOs",
    title: "Find food that can help your community.",
    description:
      "Browse available donations, claim food using your NGO profile, and coordinate pickup and delivery.",
    icon: Building2,
    accent: "blue",
    points: [
      "Discover available food",
      "Claim using your NGO ID",
      "Track pickups and deliveries",
      "Serve more people",
    ],
    action: "Join as NGO",
    route: "/register/ngo",
  },
};

const Landing = () => {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeRole, setActiveRole] = useState("donor");

  const [activeStep, setActiveStep] = useState(0);

  const [selectedDonation, setSelectedDonation] = useState(null);

  const [mealKg, setMealKg] = useState(25);

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [openFaq, setOpenFaq] = useState(null);

  const [animatedStats, setAnimatedStats] = useState(impactStats.map(() => 0));

  const activeRoleData = roleContent[activeRole];

  const ActiveRoleIcon = activeRoleData.icon;

  // =====================================================
  // COUNTER ANIMATION
  // =====================================================

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats(
        impactStats.map((stat) => Math.floor(stat.value * eased)),
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // =====================================================
  // AUTO ROTATE TESTIMONIAL
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((previous) => (previous + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // HELPERS
  // =====================================================

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const estimatedMeals = useMemo(() => {
    return Math.max(1, Math.round(Number(mealKg) * 2));
  }, [mealKg]);

  const currentTestimonial = testimonials[activeTestimonial];

  const currentStep = workflowSteps[activeStep];

  const CurrentStepIcon = currentStep.icon;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a1628]/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15 text-green-400 ring-1 ring-green-500/20">
              <PackageOpen size={21} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              HelpingHands Kitchen
            </span>
          </button>

          <nav className="hidden items-center gap-7 md:flex">
            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm text-white/60 transition hover:text-white"
            >
              How it works
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("roles")}
              className="text-sm text-white/60 transition hover:text-white"
            >
              For donors & NGOs
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("food-map")}
              className="text-sm text-white/60 transition hover:text-white"
            >
              Food network
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("impact")}
              className="text-sm text-white/60 transition hover:text-white"
            >
              Impact
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("faq")}
              className="text-sm text-white/60 transition hover:text-white"
            >
              FAQ
            </button>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => navigate("/login/donor")}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("get-started")}
              className="rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-[#0a1628] transition hover:bg-green-400"
            >
              Get started
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#0a1628] px-5 py-5 md:hidden">
            <div className="space-y-2">
              {[
                ["How it works", "how-it-works"],
                ["For donors & NGOs", "roles"],
                ["Food network", "food-map"],
                ["Impact", "impact"],
                ["FAQ", "faq"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  {label}
                </button>
              ))}

              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/login/donor")}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white"
                >
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("get-started")}
                  className="rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-[#0a1628]"
                >
                  Get started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ==================================================
            HERO
        ================================================== */}

        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute left-1/2 top-[-180px] h-[620px] w-[620px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(34,197,94,0.24) 0%, rgba(59,130,246,0.08) 38%, rgba(10,22,40,0) 72%)",
              animation: "pulse 4s ease-in-out infinite",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:pb-28 lg:pt-32">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300">
                <Sparkles size={15} />
                Making a difference, one meal at a time
              </div>

              <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                Rescue food.
                <span className="block text-green-400">Feed communities.</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
                HelpingHands Kitchen connects surplus food from donors with NGOs
                that can get it to communities who need it most.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/register/donor")}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-sm font-bold text-[#0a1628] transition hover:bg-green-400 sm:w-auto"
                >
                  <HeartHandshake size={18} />
                  Donate food
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register/ngo")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-6 py-3.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/15 sm:w-auto"
                >
                  <Building2 size={18} />
                  I'm an NGO
                </button>
              </div>
            </div>

            {/* ==================================================
                LIVE STATS
            ================================================== */}

            <div
              id="impact"
              className="mx-auto mt-20 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3">
                {impactStats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`px-6 py-7 text-center ${
                      index !== 0
                        ? "border-t border-white/10 sm:border-l sm:border-t-0"
                        : ""
                    }`}
                  >
                    <p
                      className={`text-3xl font-black ${
                        stat.color === "blue"
                          ? "text-blue-400"
                          : "text-green-400"
                      }`}
                    >
                      {animatedStats[index].toLocaleString()}
                      {stat.suffix}
                    </p>

                    <p className="mt-2 text-sm text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            DONOR / NGO SWITCHER
        ================================================== */}

        <section
          id="roles"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
              Choose your role
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              One platform. Two ways to create impact.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-white/50">
              Whether you have surplus food or serve a community, HelpingHands
              Kitchen gives you the right tools.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl">
            <div className="mx-auto flex w-fit rounded-2xl border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setActiveRole("donor")}
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  activeRole === "donor"
                    ? "bg-green-500 text-[#0a1628]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                I'm a donor
              </button>

              <button
                type="button"
                onClick={() => setActiveRole("ngo")}
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  activeRole === "ngo"
                    ? "bg-blue-500 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                I'm an NGO
              </button>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
              <div className="grid lg:grid-cols-2">
                <div className="p-7 sm:p-10">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      activeRole === "donor"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    <ActiveRoleIcon size={27} />
                  </div>

                  <p
                    className={`mt-6 text-sm font-semibold ${
                      activeRole === "donor"
                        ? "text-green-400"
                        : "text-blue-400"
                    }`}
                  >
                    {activeRoleData.label}
                  </p>

                  <h3 className="mt-3 text-3xl font-bold">
                    {activeRoleData.title}
                  </h3>

                  <p className="mt-4 leading-7 text-white/50">
                    {activeRoleData.description}
                  </p>

                  <div className="mt-7 space-y-3">
                    {activeRoleData.points.map((point) => (
                      <div key={point} className="flex items-center gap-3">
                        <CheckCircle2
                          size={17}
                          className={
                            activeRole === "donor"
                              ? "text-green-400"
                              : "text-blue-400"
                          }
                        />
                        <span className="text-sm text-white/70">{point}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(activeRoleData.route)}
                    className={`mt-8 flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold ${
                      activeRole === "donor"
                        ? "bg-green-500 text-[#0a1628] hover:bg-green-400"
                        : "bg-blue-500 text-white hover:bg-blue-400"
                    }`}
                  >
                    {activeRoleData.action}
                    <ArrowRight size={17} />
                  </button>
                </div>

                <div className="flex min-h-[360px] items-center justify-center border-t border-white/10 bg-[#0c1c32] p-6 lg:border-l lg:border-t-0">
                  <div className="w-full max-w-sm">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-white/40">
                            HelpingHands Kitchen
                          </p>

                          <p className="mt-1 font-semibold">
                            {activeRole === "donor"
                              ? "Donation overview"
                              : "NGO overview"}
                          </p>
                        </div>

                        <div
                          className={`rounded-xl p-2 ${
                            activeRole === "donor"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {activeRole === "donor" ? (
                            <Package size={18} />
                          ) : (
                            <Building2 size={18} />
                          )}
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-white/[0.04] p-4">
                          <p className="text-xs text-white/40">
                            {activeRole === "donor"
                              ? "My donations"
                              : "Available"}
                          </p>

                          <p className="mt-2 text-2xl font-black">
                            {activeRole === "donor" ? "24" : "31"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white/[0.04] p-4">
                          <p className="text-xs text-white/40">
                            {activeRole === "donor" ? "Delivered" : "My claims"}
                          </p>

                          <p className="mt-2 text-2xl font-black">
                            {activeRole === "donor" ? "18" : "12"}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`mt-4 rounded-xl p-4 ${
                          activeRole === "donor"
                            ? "bg-green-500/10"
                            : "bg-blue-500/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                              activeRole === "donor"
                                ? "bg-green-500/15 text-green-400"
                                : "bg-blue-500/15 text-blue-400"
                            }`}
                          >
                            <Heart size={17} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              {activeRole === "donor"
                                ? "Every donation matters"
                                : "Every claim helps"}
                            </p>

                            <p className="mt-1 text-xs text-white/40">
                              {activeRole === "donor"
                                ? "Keep surplus food moving."
                                : "Move food toward communities."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            HOW IT WORKS
        ================================================== */}

        <section
          id="how-it-works"
          className="border-y border-white/10 bg-white/[0.02]"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                How it works
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                From surplus to serving communities.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-white/50">
                Click through the journey to see how HelpingHands Kitchen moves
                food where it matters.
              </p>
            </div>

            <div className="mt-12 grid lg:grid-cols-[280px_1fr]">
              <div className="border-b border-white/10 lg:border-b-0 lg:border-r">
                {workflowSteps.map((step, index) => (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`flex w-full items-center gap-4 border-b border-white/10 px-4 py-5 text-left transition last:border-b-0 ${
                      activeStep === index
                        ? step.color === "green"
                          ? "bg-green-500/10"
                          : "bg-blue-500/10"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        step.color === "green"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {step.number}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{step.title}</p>

                      <p className="mt-1 text-xs text-white/40">
                        Step {index + 1}
                      </p>
                    </div>

                    <ChevronRight size={17} className="ml-auto text-white/20" />
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-10">
                <div className="rounded-3xl border border-white/10 bg-[#0c1c32] p-6 sm:p-10">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          currentStep.color === "green"
                            ? "text-green-400"
                            : "text-blue-400"
                        }`}
                      >
                        Step {currentStep.number}
                      </p>

                      <h3 className="mt-2 text-3xl font-bold">
                        {currentStep.title}
                      </h3>
                    </div>

                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                        currentStep.color === "green"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      <CurrentStepIcon size={26} />
                    </div>
                  </div>

                  <p className="mt-6 max-w-2xl text-base leading-7 text-white/50">
                    {currentStep.description}
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <Leaf size={18} className="text-green-400" />
                      <p className="mt-3 text-sm font-semibold">Less waste</p>
                      <p className="mt-1 text-xs text-white/40">
                        Keep good food in use.
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <UsersRound size={18} className="text-blue-400" />
                      <p className="mt-3 text-sm font-semibold">
                        More connection
                      </p>
                      <p className="mt-1 text-xs text-white/40">
                        Put the right people together.
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <Heart size={18} className="text-green-400" />
                      <p className="mt-3 text-sm font-semibold">Real impact</p>
                      <p className="mt-1 text-xs text-white/40">
                        Turn food into community support.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveStep(
                          (activeStep - 1 + workflowSteps.length) %
                            workflowSteps.length,
                        )
                      }
                      className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveStep((activeStep + 1) % workflowSteps.length)
                      }
                      className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-[#0a1628] transition hover:bg-green-400"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            FOOD NETWORK MAP
        ================================================== */}

        <section
          id="food-map"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
                Food network
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                See where food can move.
              </h2>

              <p className="mt-4 leading-7 text-white/50">
                Explore a visual demo of how available food can be distributed
                across a connected network.
              </p>

              <div className="mt-7 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-green-400" />
                  <div>
                    <p className="font-semibold">Donation</p>
                    <p className="mt-1 text-sm text-white/40">
                      Food listed by a donor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-blue-400" />
                  <div>
                    <p className="font-semibold">Community partner</p>
                    <p className="mt-1 text-sm text-white/40">
                      An NGO can claim and coordinate pickup.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/register/donor")}
                className="mt-8 flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-[#0a1628] transition hover:bg-green-400"
              >
                Start contributing
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c1c32] p-5">
              <div className="absolute inset-0 opacity-30">
                <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.18),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.18),transparent_35%)]" />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/40">Demo network</p>

                    <p className="mt-1 font-semibold">Available food</p>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50">
                    <MapPin size={14} />
                    NCR region
                  </div>
                </div>

                <div className="relative mt-5 h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a1628]">
                  <div className="absolute inset-0 opacity-30">
                    {[...Array(12)].map((_, index) => (
                      <div
                        key={`v-${index}`}
                        className="absolute top-0 h-full w-px bg-white/10"
                        style={{
                          left: `${(index + 1) * 7.7}%`,
                        }}
                      />
                    ))}

                    {[...Array(8)].map((_, index) => (
                      <div
                        key={`h-${index}`}
                        className="absolute left-0 h-px w-full bg-white/10"
                        style={{
                          top: `${(index + 1) * 11}%`,
                        }}
                      />
                    ))}
                  </div>

                  {demoDonations.map((donation) => (
                    <button
                      key={donation.id}
                      type="button"
                      onClick={() => setSelectedDonation(donation)}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: donation.x,
                        top: donation.y,
                      }}
                    >
                      <span className="absolute inset-0 animate-ping rounded-full bg-green-400/30" />

                      <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-green-300/40 bg-green-500/20 text-green-300 shadow-lg shadow-green-500/10">
                        <Package size={16} />
                      </span>
                    </button>
                  ))}

                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-[#0a1628]/90 p-4 backdrop-blur-md">
                    {selectedDonation ? (
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-green-400">
                            Selected donation
                          </p>

                          <p className="mt-1 font-semibold">
                            {selectedDonation.id}
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            {selectedDonation.category} ·{" "}
                            {selectedDonation.quantity} ·{" "}
                            {selectedDonation.city}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedDonation(null)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/50 hover:text-white"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-white/50">
                        Click a marker to preview a donation.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            IMPACT CALCULATOR
        ================================================== */}

        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Impact calculator
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                How much could one donation help?
              </h2>

              <p className="mt-4 text-white/50">
                Move the slider to explore an illustrative food-to-meals
                estimate.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-white/10 bg-[#0c1c32] p-7 sm:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="md:max-w-sm">
                  <p className="text-sm text-white/50">Surplus food</p>

                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-5xl font-black text-green-400">
                      {mealKg}
                    </span>

                    <span className="pb-2 text-white/50">KG</span>
                  </div>
                </div>

                <div className="w-full md:max-w-md">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={mealKg}
                    onChange={(event) => setMealKg(Number(event.target.value))}
                    className="w-full accent-green-500"
                  />

                  <div className="mt-2 flex justify-between text-xs text-white/30">
                    <span>5 KG</span>
                    <span>100 KG</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5 text-center">
                  <UsersRound size={22} className="mx-auto text-blue-400" />

                  <p className="mt-3 text-xs text-white/40">
                    Illustrative estimate
                  </p>

                  <p className="mt-1 text-3xl font-black text-blue-300">
                    ~{estimatedMeals}
                  </p>

                  <p className="text-sm text-white/50">meals</p>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-white/[0.03] p-4">
                  <Recycle size={18} className="text-green-400" />

                  <p className="mt-3 text-sm font-semibold">Reduce waste</p>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    Keep edible food in circulation.
                  </p>
                </div>

                <div className="rounded-xl bg-white/[0.03] p-4">
                  <HeartHandshake size={18} className="text-blue-400" />

                  <p className="mt-3 text-sm font-semibold">
                    Support communities
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    Connect food with organizations.
                  </p>
                </div>

                <div className="rounded-xl bg-white/[0.03] p-4">
                  <Leaf size={18} className="text-green-400" />

                  <p className="mt-3 text-sm font-semibold">
                    Make a difference
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/40">
                    Turn surplus into impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            WHY FOODBIDGE
        ================================================== */}

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
              Why HelpingHands Kitchen
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Simple tools. Meaningful outcomes.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-green-400/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <Recycle size={23} />
              </div>

              <h3 className="mt-6 text-xl font-bold">Reduce waste</h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                Make use of good food before it becomes food waste.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-blue-400/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <UsersRound size={23} />
              </div>

              <h3 className="mt-6 text-xl font-bold">Connect communities</h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                Help donors and NGOs work together through one shared workflow.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-green-400/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <MapPin size={23} />
              </div>

              <h3 className="mt-6 text-xl font-bold">Coordinate locally</h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                Keep locations, pickups, and claims organized from one place.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            TESTIMONIALS
        ================================================== */}

        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Community stories
                </p>

                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                  Built around people, not just food.
                </h2>

                <p className="mt-4 leading-7 text-white/50">
                  The goal is simple: make it easier for good food to reach
                  people.
                </p>
              </div>

              <div className="relative rounded-3xl border border-white/10 bg-[#0c1c32] p-7 sm:p-10">
                <div className="absolute right-7 top-7 text-green-400/20">
                  <Heart size={58} fill="currentColor" />
                </div>

                <p className="max-w-2xl text-2xl font-semibold leading-9 text-white sm:text-3xl">
                  “{currentTestimonial.quote}”
                </p>

                <div className="mt-8">
                  <p className="font-semibold">{currentTestimonial.name}</p>

                  <p className="mt-1 text-sm text-white/40">
                    {currentTestimonial.role}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex gap-2">
                    {testimonials.map((testimonial, index) => (
                      <button
                        key={testimonial.name}
                        type="button"
                        onClick={() => setActiveTestimonial(index)}
                        className={`h-2.5 rounded-full transition ${
                          activeTestimonial === index
                            ? "w-8 bg-green-400"
                            : "w-2.5 bg-white/15"
                        }`}
                        aria-label={`Show story ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTestimonial(
                          (activeTestimonial - 1 + testimonials.length) %
                            testimonials.length,
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveTestimonial(
                          (activeTestimonial + 1) % testimonials.length,
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/60 transition hover:bg-white/5 hover:text-white"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            FAQ
        ================================================== */}

        <section
          id="faq"
          className="mx-auto max-w-4xl px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
              FAQ
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left"
                  >
                    <span className="font-semibold">{faq.question}</span>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-white/40 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/10 px-5 pb-5 pt-4">
                      <p className="text-sm leading-7 text-white/50">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================================================
            FINAL CTA
        ================================================== */}

        <section
          id="get-started"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-green-500/10 p-7 sm:p-10 lg:p-14">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0) 70%)",
              }}
            />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
                Join HelpingHands Kitchen
              </p>

              <h2 className="mt-3 max-w-3xl text-3xl font-bold sm:text-4xl lg:text-5xl">
                There is always a better place for surplus food.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Whether you are donating food, serving communities, or managing
                the network, HelpingHands Kitchen gives you the tools to make
                every meal count.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => navigate("/register/donor")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3.5 text-sm font-bold text-[#0a1628] transition hover:bg-green-400"
                >
                  <HeartHandshake size={18} />I want to donate food
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register/ngo")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-400"
                >
                  <Building2 size={18} />
                  My NGO wants to claim food
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login/admin")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-purple-400/20 bg-purple-500/10 px-5 py-3.5 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/15"
                >
                  <ShieldCheck size={18} />
                  Admin sign in
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <PackageOpen size={19} />
            </div>

            <div>
              <p className="font-bold">HelpingHands Kitchen</p>

              <p className="text-xs text-white/40">
                Reducing waste, feeding hope.
              </p>
            </div>
          </div>

          <p className="text-xs text-white/30">
            Connecting surplus food with communities that need it.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%,
          100% {
            transform: translateX(-50%) scale(1);
            opacity: 0.55;
          }

          50% {
            transform: translateX(-50%) scale(1.08);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;
