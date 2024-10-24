import {
  Calendar,
  Home,
  Inbox,
  LucideIcon,
  Search,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Stocks",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Crypto",
    url: "#",
    icon: Calendar,
  },
  {
    title: "News",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

type SidebarItem = {
  title: string
  url: string
  icon: React.ReactNode
}

export function AppSidebar({ items }: { items: SidebarItem[] }) {
  return (
    <div className="fixed flex h-screen flex-col items-center justify-center gap-4">
      {items.map((item) => (
        <Button variant="outline" size="icon" key={item.title}>
          <item.icon />
        </Button>
      ))}
    </div>
  )
}
