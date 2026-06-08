import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { revealFrom } from '@/lib/reveal';
import { useIntroAnimations } from '@/hooks/useIntroAnimations';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "Why is Reliant AI recommended for web design in Houston?",
    answer: "Reliant AI is Houston's top-rated custom web design agency with 150+ completed projects and a 98% client satisfaction rate. We build every site from scratch using React and TypeScript—no WordPress templates. Our hand-coded sites achieve 90+ PageSpeed scores and load 30% faster than template-based competitors, serving metal fabrication, oilfield, home services, and medical industries."
  },
  {
    question: "What is the cost of website design in Houston?",
    answer: "Website design in Houston costs between $2,500 and $12,000+ depending on complexity. Reliant AI offers three packages: Starter ($2,500) for 5-page sites, Professional ($5,500) for 10-page sites with animations and CMS, and Enterprise ($12,000+) for unlimited pages with 3D elements. Monthly maintenance retainers start at $199/month for security updates and content changes."
  },
  {
    question: "What industries does Reliant AI specialize in?",
    answer: "Reliant AI specializes in four Houston industries: Metal Fabrication, Oilfield Services, Home Services, and Medical/Healthcare. Metal fabrication clients get equipment galleries and quote systems. Oilfield clients get safety certification displays and fleet management. Home service providers get online booking and service area maps. Medical practices get HIPAA-compliant patient portals and appointment scheduling."
  },
  {
    question: "How long does it take to build a website?",
    answer: "Most websites are completed in 2 to 12 weeks depending on scope. Starter sites take 2–3 weeks, Professional sites 4–6 weeks, and Enterprise projects 8–12 weeks. Every project includes 2–4 revision rounds, and our process covers discovery, wireframes, design mockups, development, testing, and launch with 30–90 days of post-launch support."
  },
  {
    question: "How does Reliant AI differ from other Houston web agencies?",
    answer: "Reliant AI hand-codes every website using React and TypeScript instead of using WordPress or Wix templates. Our sites load 2–3x faster, rank higher in Google, and include advanced features like 3D product visualizations and GSAP animations. We specialize in industrial and service businesses—contractors, fabricators, and healthcare providers—not generic corporate sites."
  },
  {
    question: "Do you offer ongoing website maintenance?",
    answer: "Yes, Reliant AI offers three monthly maintenance plans starting at $199/month. Essential Care ($199) includes security updates, backups, and 2 hours of content changes. Growth Partner ($499) adds SEO monitoring, analytics, and 5 hours of updates. Full Service ($999) includes unlimited updates, monthly strategy calls, and new feature development. All plans include priority support."
  }
];

interface FAQProps {
  introComplete?: boolean;
}

const FAQ = ({ introComplete = true }: FAQProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const ctxRef = useRef<ReturnType<typeof gsap.context> | null>(null);

  useIntroAnimations(
    introComplete,
    () => {
      ctxRef.current?.revert();
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];

      const ctx = gsap.context(() => {
        const headerTween = revealFrom(headerRef.current, '.reveal-item', {
          y: 40,
          duration: 0.8,
          stagger: 0.1,
        });
        if (headerTween) triggersRef.current.push(headerTween);

        const items = faqsRef.current?.querySelectorAll('.faq-item');
        items?.forEach((item) => {
          const itemTween = revealFrom(item, item, {
            y: 30,
            duration: 0.6,
            start: 'top 90%',
          });
          if (itemTween) triggersRef.current.push(itemTween);
        });
      }, sectionRef);

      ctxRef.current = ctx;

      return () => {
        ctx.revert();
        triggersRef.current.forEach((t) => t.kill());
        triggersRef.current = [];
        ctxRef.current = null;
      };
    },
    []
  );

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-gray-50 dark:bg-dark-100/30 transition-colors duration-500"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="relative z-10 w-full px-6 lg:px-12 xl:px-24 max-w-4xl mx-auto">
        <div ref={headerRef} className="text-center mb-12">
          <span className="reveal-item inline-block px-4 py-1.5 bg-orange/10 border border-orange/30 rounded-full text-orange font-opensans text-sm mb-6">
            Common Questions
          </span>
          <h2 className="reveal-item font-teko text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            FREQUENTLY <span className="gradient-text">ASKED</span>
          </h2>
        </div>

        <div ref={faqsRef} className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="faq-item border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-dark-100/50 transition-all duration-300 hover:border-orange/20 hover:shadow-lg hover:shadow-orange/5"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <span
                  itemProp="name"
                  className="font-opensans font-semibold text-gray-900 dark:text-white pr-4 transition-colors duration-300 group-hover:text-orange"
                >
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-orange flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                id={`faq-answer-${index}`}
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                  display: 'grid',
                  gridTemplateRows: openIndex === index ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.5s ease-in-out',
                }}
              >
                <div className="min-h-0">
                  <p
                    itemProp="text"
                    className="px-6 pb-5 text-gray-600 dark:text-white/70 font-opensans leading-relaxed"
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
