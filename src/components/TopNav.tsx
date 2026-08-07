import { CircleHelp, Bell } from "lucide-react";
import { PulseLogo } from "./PulseLogo";

interface TopNavProps {
  onHomeClick?: () => void;
  showUserIcons?: boolean;
}

export function TopNav({ onHomeClick, showUserIcons }: TopNavProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-[72px] max-w-[1280px] mx-auto">
        <button onClick={onHomeClick} className="flex items-center hover:opacity-80 transition-opacity">
          <PulseLogo />
        </button>
        
        {!showUserIcons ? (
          <>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={onHomeClick} className="text-[16px] font-medium text-on-surface-variant hover:text-on-surface transition-colors">Home</button>
              <a href="#" className="text-[16px] font-medium text-on-surface-variant hover:text-on-surface transition-colors">Services</a>
              <a href="#" className="text-[16px] font-medium text-on-surface-variant hover:text-on-surface transition-colors">Support</a>
            </div>

            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <CircleHelp className="w-6 h-6" />
            </button>
          </>
        ) : (
          <div className="flex items-center space-x-6">
            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <CircleHelp className="w-6 h-6" />
            </button>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer flex items-center justify-center bg-surface-container font-medium text-on-surface text-[14px]">
              <span className="text-[14px] font-medium text-on-surface">JD</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
