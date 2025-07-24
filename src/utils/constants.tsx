import {
  UserX,
  ShieldAlert,
  Clock,
  Eye,
  PackageMinus,
  Zap,
  Briefcase,
  ScanFace,
  AlertOctagon,
  UserPlus,
  UserCheck,
  HelpCircle,
} from "lucide-react";

export const humanThreats = [
  {
    id: "unauthorised",
    label: "Unauthorized Access",
    icon: <UserX className="w-3 h-3 text-red-500" />,
    badgeStyle: "bg-orange-950 border-l-3 border-orange-500 text-orange-300",
  },
  {
    id: "gun",
    label: "Weapon Detected",
    icon: <ShieldAlert className="w-3 h-3 text-red-600" />,
    badgeStyle: "bg-red-950 border-l-3 border-rose-500 text-red-300",
  },
  {
    id: "intrusion",
    label: "Intrusion After Hours",
    icon: <Clock className="w-3 h-3 text-orange-500" />,
    badgeStyle: "bg-orange-950 border-l-3 border-orange-500 text-orange-300",
  },
  {
    id: "loitering",
    label: "Loitering",
    icon: <Eye className="w-3 h-3 text-yellow-500" />,
    badgeStyle: "bg-yellow-950 border-l-3 border-yellow-500 text-yellow-300",
  },
  {
    id: "shoplifting",
    label: "Shoplifting Behavior",
    icon: <PackageMinus className="w-3 h-3 text-red-400" />,
    badgeStyle: "bg-red-900 border-l-3 border-red-400 text-red-200",
  },
  {
    id: "aggressive",
    label: "Aggressive Behavior",
    icon: <Zap className="w-3 h-3 text-red-500" />,
    badgeStyle: "bg-red-950 border-l-3 border-red-500 text-red-300",
  },
  {
    id: "abandoned",
    label: "Abandoned Object",
    icon: <Briefcase className="w-3 h-3 text-purple-500" />,
    badgeStyle: "bg-purple-950 border-l-3 border-purple-500 text-purple-300",
  },
  {
    id: "face-not-recognized",
    label: "Face Not Recognized",
    icon: <ScanFace className="w-3 h-3 text-blue-500" />,
    badgeStyle: "bg-blue-950 border-l-3 border-blue-500 text-blue-300",
  },
  {
    id: "blacklisted",
    label: "Blacklisted Person Detected",
    icon: <AlertOctagon className="w-3 h-3 text-red-600" />,
    badgeStyle: "bg-red-950 border-l-3 border-red-600 text-red-300",
  },
  {
    id: "tailgating",
    label: "Tailgating Detected",
    icon: <UserPlus className="w-3 h-3 text-orange-400" />,
    badgeStyle: "bg-orange-950 border-l-3 border-orange-400 text-orange-200",
  },
  {
    id: "mask",
    label: "Mask Detected in Restricted Zone",
    icon: <UserCheck className="w-3 h-3 text-green-500" />,
    badgeStyle: "bg-green-950 border-l-3 border-green-500 text-green-300",
  },
  {
    id: "suspicious",
    label: "Suspicious Behavior",
    icon: <HelpCircle className="w-3 h-3 text-yellow-600" />,
    badgeStyle: "bg-yellow-950 border-l-3 border-yellow-600 text-yellow-300",
  },
];

export const env = (key: string) => {
  return process.env[key];
};
