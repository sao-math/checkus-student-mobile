
import React from "react";
import { Link } from "react-router-dom";
import { User, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

// Mock user data - in a real app, this would come from a user context or auth service
const mockUserRole = "student"; // Could be "student", "parent", "teacher"

// Let's check if the URL contains a role parameter to override the mock role
// This is for demonstration purposes only
const getRole = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.search.includes('role=parent') ? 'parent' : mockUserRole;
  }
  return mockUserRole;
};

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const userRole = getRole();
  
  return (
    <header className={cn("w-full flex justify-between items-center px-4 h-16 bg-background border-b", className)}>
      <div className="flex items-center">
        <Link to="/dashboard">
          <Logo />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {/* Only show the parent connection link for students */}
        {userRole === "student" && (
          <Link to="/parent-connection" className="text-sm font-medium hover:text-primary flex items-center gap-1">
            <LinkIcon className="h-4 w-4" />
            <span>학부모 연결</span>
          </Link>
        )}
        <Link to="/account" className="p-2 rounded-full hover:bg-accent">
          <User className="h-5 w-5 text-gray-600" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
