import { Target, Brain, Zap, Users } from "lucide-react";
import StopwatchIcon from "@/components/StopwatchIcon";

export function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const categories = [
    { id: "all", name: "All Lessons", icon: Target },
    { id: "decision-making", name: "Decision Making", icon: Brain },
    { id: "stress-response", name: "Stress Response", icon: Zap },
    { id: "communication", name: "Communication", icon: Users },
    { id: "emotional-clarity", name: "Emotional Clarity", icon: StopwatchIcon },
    { id: "shadow-work", name: "Shadow Work", icon: Brain },
    { id: "attachment-styles", name: "Attachment Styles", icon: StopwatchIcon },
  ];

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex gap-3 pb-2 min-w-max">
        {categories.map((category) => {
          const IconComponent = category.icon;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-montserrat font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-[#538890] text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 text-[#538890] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {IconComponent === StopwatchIcon ? (
                <StopwatchIcon
                  className="w-4 h-4"
                  color={selectedCategory === category.id ? "white" : "#538890"}
                />
              ) : (
                <IconComponent className="w-4 h-4" />
              )}
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
