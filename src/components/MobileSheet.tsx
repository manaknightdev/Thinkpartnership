import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import React from "react";

interface MobileSheetProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export const MobileSheet: React.FC<MobileSheetProps> = ({ title, description, children, side = "left" }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={side} className="w-[250px] sm:w-[300px] flex flex-col">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="flex-grow overflow-y-auto py-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};