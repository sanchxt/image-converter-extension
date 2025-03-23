import { ReactNode } from "react";
import Header from "./Header";
import TabInterface from "./TabInterface";
import Toolbar from "./Toolbar";
import { TabId } from "../types/tabs.types";

interface LayoutProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
  activeTab: TabId;
  setActiveTab: (tabId: TabId) => void;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  theme,
  toggleTheme,
  activeTab,
  setActiveTab,
  children,
}) => {
  return (
    <div
      className={`min-h-screen w-full min-w-[400px] ${theme}`}
      style={{
        background: `linear-gradient(180deg, var(--bg-gradient-1), var(--bg-gradient-2), var(--bg-gradient-3))`,
      }}
    >
      <div className="max-w-md mx-auto pb-6">
        <Header theme={theme} toggleTheme={toggleTheme} />

        <main className="px-4 space-y-4">
          <section className="text-center space-y-2 animate-fade-in">
            <h1
              className="text-2xl font-bold text-primary pt-2 font-nunito animate-glow
                            bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text"
            >
              Image Converter
            </h1>

            <div className="relative overflow-hidden h-5 group">
              <p className="text-xs text-secondary italic absolute w-full transition-all duration-500 transform translate-y-0 group-hover:translate-y-[-200%]">
                Complete Image Toolkit
              </p>
              <p className="text-xs text-brand-300 italic absolute w-full transition-all duration-500 transform translate-y-[200%] group-hover:translate-y-0">
                Completely Free
              </p>
            </div>
          </section>

          <Toolbar theme={theme} toggleTheme={toggleTheme} />

          <TabInterface activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="min-h-[380px]">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
