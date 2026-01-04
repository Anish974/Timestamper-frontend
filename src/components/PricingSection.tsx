import React from "react";

const plans = [
  {
    name: "Free",
    price: 0,
    exports: 3,
    description: "3 exports/month",
    button: "Get Started",
    disabled: true,
    link: null,
    features: [
      "3 exports per month",
    ],
  },
  {
    name: "Pro",
    price: 10,
    exports: 10,
    description: "10 exports/month",
    button: "Buy Pro →",
    disabled: false,
    link: "https://razorpay.me/@ayusuniversal",
    featured: true,
    features: [
      "10 exports per month",
    ],
  },
  {
    name: "Business",
    price: 40,
    exports: 50,
    description: "50 exports/month",
    button: "Buy Business →",
    disabled: false,
    link: "https://razorpay.me/@ayusuniversal",
    features: [
      "50 exports per month",
    ],
  },
  {
    name: "Unlimited",
    price: 100,
    exports: "Unlimited",
    description: "Unlimited exports/month",
    button: "Buy Unlimited →",
    disabled: false,
    link: "https://razorpay.me/@ayusuniversal",
    features: [
      "Unlimited exports",
    ],
  },
];

const faqs = [
  {
    question: "Can I change my plan anytime?",
    answer:
      "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major payment methods including credit cards, debit cards, and UPI through Razorpay.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! Start with our free plan to test all basic features without any credit card required.",
  },
  {
    question: "Do unused exports carry over?",
    answer:
      "No, monthly exports reset at the beginning of each billing cycle. Pro tip: Use them before they reset!",
  },
  {
    question: "Need custom pricing?",
    answer:
      "For enterprise needs, contact our sales team and we'll create a custom plan for you.",
  },
];

export default function PricingSection() {
  return (
    <div className="w-full">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top duration-500">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Pricing
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            Choose the perfect plan for your needs
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`group relative animate-in fade-in slide-in-from-bottom duration-500 ${
                plan.featured ? "lg:scale-105 lg:z-10" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Background with Glassmorphism */}
              <div
                className={`relative h-full rounded-2xl border backdrop-blur-xl transition-all duration-400 overflow-hidden
                  ${
                    plan.featured
                      ? "border-primary bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/40 shadow-2xl"
                      : "border-slate-700/50 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/20 hover:border-slate-600/80 shadow-lg hover:shadow-2xl hover:-translate-y-4"
                  }
                `}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

                {/* Badge */}
                {plan.featured && (
                  <div className="absolute -top-3 -right-12 rotate-45 bg-gradient-to-r from-primary to-accent text-white px-12 py-1 text-xs font-bold uppercase tracking-wider shadow-lg">
                    Popular
                  </div>
                )}

                {/* Content */}
                <div className="relative p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ₹{plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-sm text-muted-foreground">/month</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="flex-grow mb-8 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mt-0.5">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-300 leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  {plan.link ? (
                    <a
                      href={plan.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-center transition-all duration-300 transform
                        ${
                          plan.featured
                            ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                            : "bg-transparent border-2 border-slate-600 text-slate-300 hover:border-primary hover:text-primary hover:bg-primary/10"
                        }
                      `}
                    >
                      {plan.button}
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-lg font-semibold text-center bg-slate-700/50 text-slate-500 cursor-not-allowed opacity-50"
                    >
                      {plan.button}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 animate-in fade-in slide-in-from-bottom duration-500 delay-500">
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/20 backdrop-blur-xl p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-xl bg-slate-900/40 border border-slate-700/50 hover:border-slate-600/80 transition-all duration-300 hover:bg-slate-900/60 hover:translate-x-1"
                >
                  <h4 className="text-base font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {faq.question}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
