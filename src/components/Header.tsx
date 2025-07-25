"use Client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  AlertTriangle,
  Camera,
  Cctv,
  ChevronDown as ChevronDownIcon,
  Layers,
  LayoutDashboard,
  Users,
} from "lucide-react";
import React from "react";

// Navigation menu items data
const navItems = [
  {
    icon: (
      <LayoutDashboard className="w-4 h-4 stroke-black/50 fill-accent-foreground stroke-1" />
    ),
    label: "Dashboard",
    link: "/",
  },
  {
    icon: (
      <Cctv className="w-4 h-4 stroke-black/50 fill-accent-foreground stroke-1" />
    ),
    label: "Cameras",
    link: "/camera",
  },
  {
    icon: (
      <Layers className="w-4 h-4 stroke-black/50 fill-accent-foreground stroke-1" />
    ),
    label: "Scenes",
    link: "/scene",
  },
  {
    icon: (
      <AlertTriangle className="w-4 h-4 stroke-black/50 fill-accent-foreground stroke-1" />
    ),
    label: "Incidents",
    link: "/incident",
  },
  {
    icon: (
      <Users className="w-4 h-4 stroke-1 stroke-black/50 fill-accent-foreground " />
    ),
    label: "Users",
    link: "/users",
  },
  {
    icon: (
      <Camera className="w-4 h-4 stroke-black/50 fill-accent-foreground stroke-1" />
    ),
    label: "3D View",
    link: "/3dpage",
  },
];

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="flex items-center  justify-between pt-4 pb-3 px-10 relative border-b border-[#ffffff26] w-full">
      {/* Logo */}
      <div className="inline-flex items-center gap-2.5 relative">
        <div className="relative w-5 h-6">
          <div className="relative w-5 h-6">
            {/* Logo SVG elements - replaced with placeholder image */}
            <img src="/mandlacx.png" alt="Logo" />
          </div>
        </div>

        <div className="text-white text-base">
          <span className=" font-jakarta-sans font-normal">MANDLAC</span>{" "}
          <span className="font-jakarta-sans font-bold text-lg">X</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList className="gap-4">
          {navItems.map((item, index) => (
            <NavigationMenuItem key={index} className="">
              <Button
                variant="ghost"
                className="justify-center gap-1.5 px-3 py-2.5 row rounded-md inline-flex items-center h-auto hover:bg-[#ffffff0d]"
                asChild
              >
                <NavigationMenuLink className="flex flex-row" href={item.link}>
                  {item.icon}
                  <span className="font-inter  font-bold text-white text-sm tracking-[-0.12px] leading-3.5">
                    {item.label}
                  </span>
                </NavigationMenuLink>
              </Button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* User Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex  items-center gap-2 p-2 relative rounded-full h-auto hover:bg-[#ffffff0d] border-none"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src="/images/userimage.png" alt="Mohammed Ajhas" />
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start gap-0.5 relative flex-1 grow">
              <div className="relative w-[124px] mt-[-1.00px] mr-[-4.00px] font-text-sm-leading-none-semibold font-[number:var(--text-sm-leading-none-semibold-font-weight)] text-neutral-100 text-[length:var(--text-sm-leading-none-semibold-font-size)] tracking-[var(--text-sm-leading-none-semibold-letter-spacing)] leading-[var(--text-sm-leading-none-semibold-line-height)] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] [font-style:var(--text-sm-leading-none-semibold-font-style)]">
                Mohammed Ajhas
              </div>
              <div className="relative self-stretch font-text-xs-leading-4-normal font-[number:var(--text-xs-leading-4-normal-font-weight)] text-neutral-100 text-[length:var(--text-xs-leading-4-normal-font-size)] tracking-[var(--text-xs-leading-4-normal-letter-spacing)] leading-[var(--text-xs-leading-4-normal-line-height)] overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] [font-style:var(--text-xs-leading-4-normal-font-style)]">
                ajhas@mandlac.com
              </div>
            </div>

            <ChevronDownIcon className="w-4 h-4 stroke-fill-accent-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-[#333333] text-white outline-0 border-0"
        >
          <DropdownMenuItem className="font-inter  font-semibold text-white text-sm tracking-[-0.12px] leading-3.5 hover:bg-[#ffffff0d] pb-2">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="font-inter  font-semibold text-white text-sm tracking-[-0.12px] leading-3.5 hover:bg-[#ffffff0d] ">
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="font-inter  font-semibold text-white text-sm tracking-[-0.12px] leading-3.5 hover:bg-[#ffffff0d] ">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
