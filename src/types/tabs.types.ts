export type TabId =
  | "convert"
  | "edit"
  | "crop"
  | "compress"
  | "metadata"
  | "compare";

export interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

export interface TabInterfaceProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}
