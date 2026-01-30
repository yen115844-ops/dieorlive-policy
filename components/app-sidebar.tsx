"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
    AlertTriangle,
    Bell,
    CalendarCheck,
    Heart,
    LayoutDashboard,
    Menu,
    Settings,
    Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

const sidebarItems = [
  {
    title: "Tổng quan",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Người dùng",
    href: "/users",
    icon: Users,
  },
  {
    title: "Lịch sử check-in",
    href: "/checkins",
    icon: CalendarCheck,
  },
  {
    title: "Cảnh báo khẩn cấp",
    href: "/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Thông báo",
    href: "/notifications",
    icon: Bell,
  },
];

interface SidebarProps {
  className?: string;
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600">
          <Heart className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold">Die or Live</span>
          <span className="text-xs text-muted-foreground">Trang quản trị</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive 
                    ? "bg-gradient-to-r from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4",
                  isActive && "text-rose-500"
                )} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="h-4 w-4" />
          Cài đặt
        </Link>
      </div>
    </div>
  );
}

export function AppSidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("hidden w-64 border-r bg-card lg:block", className)}>
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SidebarContent onItemClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
