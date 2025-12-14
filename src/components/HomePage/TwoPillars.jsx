import { Zap, BookOpen } from "lucide-react";
import { PillarCard } from "./PillarCard";

export function TwoPillars() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
      {/* 90-Second Reset */}
      <PillarCard
        href="/reset"
        icon={Zap}
        iconBgColor="bg-[#E6F1EB] dark:bg-[#3A4A3D]"
        title="90-Second Reset"
        subtitle="Immediate Calm for High-Stress Moments"
        description="Guided 90-second practices that help your nervous system complete the stress response — so you can stop spiraling and feel grounded again."
        features={[
          "Designed for moments of anxiety, frustration, or emotional overload",
          "No meditation experience required",
          "Can be done anywhere — desk, car, or between meetings",
        ]}
        ctaText="Begin a Reset Now"
        ctaColor="[#538890]"
        borderHoverColor="[#538890]"
      />

      {/* 90-Second Lessons */}
      <PillarCard
        href="/lessons"
        icon={BookOpen}
        iconBgColor="bg-[#D3C970]/60 dark:bg-[#8B7A3F]"
        title="90-Second Lessons"
        subtitle="Understand What's Happening in Your Brain"
        description={
          <>
            Short, practical lessons that explain <em>why</em> your emotions
            hijack your thinking — and how to regain control faster next time.
          </>
        }
        features={[
          "Learn why emotions peak and pass in ~90 seconds",
          "Build emotional literacy and self-awareness",
          "Apply neuroscience without overwhelm",
        ]}
        ctaText="Watch a 90-Second Lesson"
        ctaColor="[#D3C970]"
        borderHoverColor="[#D3C970]"
      />
    </div>
  );
}
