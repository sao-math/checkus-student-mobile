
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, showText = true }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        {/* Clock circle */}
        <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
          {/* Check mark acting as clock hands */}
          <Check 
            className="h-5 w-5 text-primary" 
            strokeWidth={2.5}
          />
        </div>
      </div>
      {showText && (
        <span className="text-lg font-medium text-primary">CheckUS</span>
      )}
    </div>
  );
};

export default Logo;
