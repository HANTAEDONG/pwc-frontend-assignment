import { Plus, Trash2, Trash } from "lucide-react";

interface IconProps {
  className?: string;
}

export const PlusIcon = ({ className = "w-4 h-4" }: IconProps) => (
  <Plus className={className} />
);

export const Trash2Icon = ({ className = "w-4 h-4" }: IconProps) => (
  <Trash2 className={className} />
);

export const ICONS = {
  plus: <Plus className="w-4 h-4" />,
  trash2: <Trash2 className="w-4 h-4" />,
  trash1: <Trash className="w-4 h-4" />,
} as const;
