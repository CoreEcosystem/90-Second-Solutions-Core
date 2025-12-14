"use client";
import { ChevronLeft, Brain, Zap, RotateCcw, Clock } from "lucide-react";
import useUser from "@/utils/useUser";

export default function SciencePage() {
  const { data: user, loading: userLoading } = useUser();
  const scienceSections = [
    {
      title: "The Initial Surge",
      icon: Zap,
      content:
        "When the brain detects a threat—real or perceived—it releases a surge of stress chemicals like adrenaline and noradrenaline. This activates the fight-or-flight response:",
      points: [
        "Heart rate increases",
        "Muscles tighten",
        "Breath becomes shallow",
        "Attention narrows",
      ],
      note: "This is automatic and biological—not a character flaw.",
    },
    {
      title: "The 90-Second Window",
      icon: Clock,
      content:
        "According to neuroscientist Dr. Jill Bolte Taylor, the chemical reaction to an emotional trigger lasts no longer than ~90 seconds unless we mentally feed it.",
      points: [
        "Emotional chemicals have a natural lifespan",
        "The wave peaks and naturally fades",
        "Simply observing without reacting allows natural resolution",
      ],
      note: "If we don't feed the emotion with thoughts, it completes its cycle.",
    },
    {
      title: "How We Keep the Storm Alive",
      icon: RotateCcw,
      content:
        "If an emotion lasts longer than 90 seconds, it's because thinking has taken over. Research from Dr. Susan Nolen-Hoeksema shows that rumination:",
      points: [
        "Prolongs emotional distress",
        "Intensifies anxiety and depression",
        "Amplifies reactivity",
        "Impairs decision-making",
      ],
      note: "We replay what happened. We add meaning. We tell mental stories. We keep the chemicals alive.",
    },
    {
      title: "The Turning Point",
      icon: Brain,
      content:
        "The moment the chemical surge subsides, you have a choice: Re-enter the loop… or reset your nervous system.",
      points: [
        "Mindful awareness",
        "Emotion labeling ('I'm feeling anger')",
        "Grounding techniques",
        "Breath work",
        "Cognitive distancing",
      ],
      note: "These tools help the brain disengage from reactivity and return to executive function.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#121212] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between h-16">
            <a
              href="/"
              className="flex items-center gap-2 font-montserrat font-semibold text-base text-[#0B3A55]/85 dark:text-white/85 hover:text-[#0B3A55] dark:hover:text-white transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Home
            </a>
            <img
              src="https://ucarecdn.com/3cfbf65a-b402-47be-8ba6-2041dda41592/-/format/auto/"
              alt="90-Second Solutions"
              className="h-10 w-auto"
            />
            <div className="w-[120px]"></div> {/* Spacer for centering */}
          </nav>
          {/* Secondary links: Reflection + Your Insights (shown when signed in) */}
          {!userLoading && user ? (
            <div className="py-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-4">
              <a
                href="/reflection"
                className="font-montserrat font-semibold text-sm text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:underline-offset-4 transition-all duration-200"
              >
                Reflection
              </a>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <a
                href="/insights"
                className="font-montserrat font-semibold text-sm text-[#538890]/85 dark:text-white/85 hover:text-[#538890] dark:hover:text-white hover:underline hover:decoration-[#538890] dark:hover:decoration-white hover:underline-offset-4 transition-all duration-200"
              >
                Your Insights
              </a>
            </div>
          ) : null}
        </div>
      </header>

      {/* Hero with background image */}
      <section className="relative w-full h-[260px] sm:h-[360px] lg:h-[440px] overflow-hidden">
        <img
          src="https://ucarecdn.com/efcf58ab-a7d0-43b9-98be-c7120187b851/-/format/auto/"
          alt="Abstract neural patterns and color around a serene face, representing the science of emotional regulation."
          className="absolute inset-0 w-full h-full object-cover object-left sm:object-center"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-white/75 dark:bg-white/60"></div>
        <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 flex items-center">
          <div className="space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 dark:bg-white/70 backdrop-blur-[2px] rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-[#0B3A55]" />
            </div>
            <h1 className="font-roboto-serif font-light text-2xl sm:text-4xl lg:text-5xl text-black max-w-3xl">
              The Science Behind the 90-Second Reset
            </h1>
            <p className="font-montserrat text-sm sm:text-base text-black/80 leading-relaxed max-w-2xl">
              Understanding the neuroscience behind emotional regulation
              empowers you to work with your brain, not against it.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Science Sections */}
        <div className="space-y-12">
          {scienceSections.map((section, index) => {
            const IconComponent = section.icon;

            return (
              <div
                key={index}
                className="bg-gradient-to-br from-[#DCE7DF]/30 via-white/50 to-[#C9D9EB]/30 dark:from-[#2F4A5C]/20 dark:via-[#1E1E1E]/50 dark:to-[#3A4A3D]/20 rounded-2xl border-2 border-[#C9D9EB] dark:border-[#2F4A5C] shadow-md p-8 sm:p-10"
              >
                <div className="flex items-start gap-6">
                  <div className="bg-[#DCE7DF]/60 dark:bg-[#3A4A3D] p-4 rounded-full flex-shrink-0">
                    <IconComponent className="w-8 h-8 text-[#0B3A55] dark:text-[#A4C3D2]" />
                  </div>

                  <div className="space-y-6 flex-1">
                    <h2 className="font-roboto-serif font-bold text-2xl sm:text-3xl text-[#0B3A55] dark:text-white/90">
                      {index + 1}. {section.title}
                    </h2>

                    <p className="font-montserrat text-base text-[#557082] dark:text-white/70 leading-relaxed">
                      {section.content}
                    </p>

                    {section.points && (
                      <ul className="space-y-3">
                        {section.points.map((point, pointIndex) => (
                          <li
                            key={pointIndex}
                            className="flex items-start gap-3"
                          >
                            <div className="w-2 h-2 bg-[#70A0B2] rounded-full mt-2 flex-shrink-0"></div>
                            <span className="font-montserrat text-base text-[#0B3A55] dark:text-white/90">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.note && (
                      <div className="bg-[#C9D9EB]/20 dark:bg-[#2F4A5C]/20 border border-[#C9D9EB]/50 dark:border-[#2F4A5C]/50 rounded-lg p-4">
                        <p className="font-montserrat text-sm text-[#557082] dark:text-white/70 italic">
                          {section.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Research Credits */}
        <div className="mt-16 bg-gradient-to-br from-[#DCE7DF]/30 via-white/50 to-[#C9D9EB]/30 dark:from-[#2F4A5C]/20 dark:via-[#1E1E1E]/50 dark:to-[#3A4A3D]/20 rounded-2xl border-2 border-[#C9D9EB] dark:border-[#2F4A5C] shadow-md p-8 space-y-6">
          <h3 className="font-roboto-serif font-bold text-xl text-[#0B3A55] dark:text-white/90 text-center">
            Research Foundation
          </h3>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-montserrat font-semibold text-base text-[#0B3A55] dark:text-white/90">
                Dr. Jill Bolte Taylor
              </h4>
              <p className="font-montserrat text-sm text-[#557082] dark:text-white/70 leading-relaxed">
                Neuroanatomist whose groundbreaking research on the 90-second
                rule revealed the natural lifespan of emotional chemicals in the
                brain.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-montserrat font-semibold text-base text-[#0B3A55] dark:text-white/90">
                Dr. Susan Nolen-Hoeksema
              </h4>
              <p className="font-montserrat text-sm text-[#557082] dark:text-white/70 leading-relaxed">
                Pioneering researcher on rumination and its role in prolonging
                emotional distress and mental health challenges.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center space-y-6">
          <h3 className="font-roboto-serif font-bold text-2xl text-[#0B3A55] dark:text-white/90">
            Ready to experience the science in action?
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/reset"
              className="bg-[#70A0B2] hover:bg-[#5C94B0] text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 justify-center"
            >
              <Zap className="w-5 h-5" />
              Try a 90-Second Reset
            </a>

            <a
              href="/lessons"
              className="bg-white dark:bg-[#1E1E1E] border-2 border-[#C9D9EB] dark:border-[#2F4A5C] hover:border-[#FFE38F] dark:hover:border-[#8B7A3F] text-[#0B3A55] dark:text-white font-montserrat font-semibold text-base px-8 py-3 rounded-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 justify-center"
            >
              <Clock className="w-5 h-5" />
              Explore Quick Lessons
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@400;700;900&family=Montserrat:wght@400;600&display=swap');
        
        .font-roboto-serif {
          font-family: 'Roboto Serif', serif;
        }
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </div>
  );
}
