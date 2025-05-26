
import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full flex justify-between items-center px-4 h-16 bg-background border-b", className)}>
      <div className="flex items-center">
        <Link to="/dashboard">
          <Logo />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/account" className="p-2 rounded-full hover:bg-accent">
          <User className="h-5 w-5 text-gray-600" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
