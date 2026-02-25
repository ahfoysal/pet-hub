import { LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { MenuItemConfig } from "@/lib/sidebarRoutes";

// Function to render icon based on the configuration
export const renderIcon = (item: MenuItemConfig) => {
  if (item.icon) {
    const Icon = item.icon;
    return <Icon className="h-5 w-5" />;
  }

  if (item.imageSrc) {
    return (
      <Image
        className="text-foreground"
        src={item.imageSrc}
        alt={item.label}
        width={item.imageSize ?? 20}
        height={item.imageSize ?? 20}
      />
    );
  }

  // Return a default icon if no icon or image is specified
  return <LayoutDashboard className="h-5 w-5" />;
};
