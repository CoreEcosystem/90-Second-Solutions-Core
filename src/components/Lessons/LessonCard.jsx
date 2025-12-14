import { useState } from "react";
import { Clock, CheckCircle, Lock, Play, X } from "lucide-react";

export function LessonCard({
  lesson,
  isCompleted,
  onComplete,
  usageData,
  trackUsage,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(lesson.duration);
  const [tracking, setTracking] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const steps = [
    { key: "problem", title: "The Challenge", content: lesson.content.problem },
    { key: "insight", title: "The Insight", content: lesson.content.insight },
    {
      key: "technique",
      title: "The Technique",
      content: lesson.content.technique,
    },
    { key: "practice", title: "Try It Now", content: lesson.content.practice },
  ];

  const currentStepData = steps[currentStep - 1];

  const startLesson = async () => {
    if (usageData && !usageData.is_premium && !tracking) {
      setTracking(true);
      const success = await trackUsage("lesson");
      setTracking(false);
      if (!success) {
        return;
      }
    }
    setIsExpanded(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(lesson.id);
      setIsExpanded(false);
      setCurrentStep(1);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "decision-making": "bg-[#E6F1EB]/80 text-[#538890]",
      "stress-response": "bg-[#E6F1EB]/80 text-[#538890]",
      communication: "bg-[#D3C970]/60 text-[#538890]",
      "emotional-clarity": "bg-[#E6F1EB]/80 text-[#538890]",
      "shadow-work": "bg-[#538890]/20 text-[#538890]",
      "attachment-styles": "bg-[#D3C970]/40 text-[#538890]",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const isLocked =
    usageData && !usageData.is_premium && usageData.lessons_limit_reached;

  return (
    <div
      className={`bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6F1EB] dark:border-gray-700 p-6 space-y-4 hover:border-[#D3C970] dark:hover:border-[#D3C970] transition-all duration-300 ${
        isLocked ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-montserrat font-semibold ${getCategoryColor(lesson.category)}`}
            >
              {lesson.category.replace("-", " ")}
            </span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-[#538890]/70 dark:text-white/60" />
              <span className="font-montserrat text-xs text-[#538890]/70 dark:text-white/60">
                {lesson.duration}s
              </span>
            </div>
            {isLocked && <Lock className="w-4 h-4 text-[#538890]/50" />}
            {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>

          <h3 className="font-roboto-serif font-bold text-xl text-[#538890] dark:text-white/90">
            {lesson.title}
          </h3>

          <p className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70 leading-relaxed">
            {lesson.description}
          </p>
        </div>
      </div>

      {/* Video Thumbnail Section */}
      {lesson.videoThumbnail && lesson.videoUrl && (
        <div
          className="relative group cursor-pointer"
          onClick={() => setShowVideo(true)}
        >
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={lesson.videoThumbnail}
              alt={`${lesson.title} video thumbnail`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg">
                <Play className="w-8 h-8 text-[#538890] ml-1" />
              </div>
            </div>
          </div>
        </div>
      )}

      {!isExpanded ? (
        <button
          onClick={startLesson}
          disabled={isLocked || tracking}
          className={`w-full font-montserrat font-semibold text-sm py-3 rounded-lg transition-all duration-200 ${
            isLocked
              ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2"
              : "bg-[#D3C970]/20 hover:bg-[#D3C970]/40 text-[#538890] dark:bg-[#D3C970]/20 dark:hover:bg-[#D3C970]/40 dark:text-white"
          }`}
        >
          {tracking ? (
            "Starting..."
          ) : isLocked ? (
            <>
              <Lock className="w-4 h-4" />
              Upgrade to Access
            </>
          ) : (
            "Start Lesson"
          )}
        </button>
      ) : (
        <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-montserrat text-xs font-semibold text-[#538890] bg-[#538890]/10 px-2 py-1 rounded">
              Step {currentStep} of {steps.length}
            </span>
            <span className="font-montserrat text-xs text-[#538890]/70 dark:text-white/60">
              ~{Math.ceil(timeRemaining / steps.length)}s
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="font-roboto-serif font-bold text-lg text-[#538890] dark:text-white/90">
              {currentStepData.title}
            </h4>
            <p className="font-montserrat text-sm text-[#538890]/70 dark:text-white/70 leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={nextStep}
              className="flex-1 bg-[#538890] hover:bg-[#538890]/90 text-white font-montserrat font-semibold text-sm py-3 rounded-lg transition-all duration-200"
            >
              {currentStep === steps.length ? "Complete Lesson" : "Next"}
            </button>
            <button
              onClick={() => {
                setIsExpanded(false);
                setCurrentStep(1);
              }}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 text-[#538890]/70 dark:text-white/70 font-montserrat font-semibold text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideo && lesson.videoUrl && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="bg-white dark:bg-[#1E1E1E] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-roboto-serif font-bold text-lg text-[#538890] dark:text-white/90">
                {lesson.title}
              </h3>
              <button
                onClick={() => setShowVideo(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#538890] dark:text-white/70" />
              </button>
            </div>
            <div className="relative w-full pb-[56.25%]">
              {" "}
              {/* 16:9 aspect ratio */}
              <iframe
                src={lesson.videoUrl}
                title={lesson.title}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
