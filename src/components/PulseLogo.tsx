import { HeartPulse } from "lucide-react";

interface PulseLogoProps {
  className?: string;
}

export function PulseLogo({ className = "" }: PulseLogoProps) {
  return (
    <div className={`flex items-center text-[#005bb5] ${className}`}>
      <HeartPulse className="w-6 h-6 mr-2" />
      <span className="text-[20px] leading-[28px] font-bold font-serif">Pulse Health</span>
    </div>
  );
}
