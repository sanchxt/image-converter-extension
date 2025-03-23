import { Tab, TabInterfaceProps } from "../types/tabs.types";

const TabInterface: React.FC<TabInterfaceProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-1 w-full min-w-max bg-accent/80 rounded-xl p-1.5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex-1
              ${
                activeTab === tab.id
                  ? "bg-brand-400 text-white shadow-elevation-1"
                  : "text-secondary hover:text-primary hover:bg-surface"
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const tabs: Tab[] = [
  {
    id: "convert",
    label: "Convert",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
  },
  {
    id: "edit",
    label: "Edit",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
  },
];

export default TabInterface;
