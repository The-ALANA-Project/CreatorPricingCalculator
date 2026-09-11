import {
  Add, ArrowBack, ArrowForward, Bolt, BookOpen, Check, ChevronDown, ChevronLeft,
  ChevronRight, ChevronUp, Circle, Close, Construction, Delete, Description,
  Download, DragIndicator, ExpandLess, ExpandMore, FileImage, Home, Image, Info,
  MenuBook, MoreHoriz, OpenInNew, PanelLeftIcon, PictureAsPdf, RadioButtonUnchecked,
  Remove, Search, Shield, Upload,
} from "@/app/lib/icons";
import type { ComponentType, CSSProperties } from "react";

interface LucideStyleProps {
  size?: number | string;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

const iconMap: Record<string, ComponentType<LucideStyleProps>> = {
  add: Add,
  arrow_back: ArrowBack,
  arrow_forward: ArrowForward,
  bolt: Bolt,
  menu_book: MenuBook,
  book_open: BookOpen,
  check: Check,
  chevron_down: ChevronDown,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  chevron_up: ChevronUp,
  circle: Circle,
  close: Close,
  construction: Construction,
  delete: Delete,
  description: Description,
  download: Download,
  drag_indicator: DragIndicator,
  expand_less: ExpandLess,
  expand_more: ExpandMore,
  file_image: FileImage,
  home: Home,
  image: Image,
  info: Info,
  more_horiz: MoreHoriz,
  open_in_new: OpenInNew,
  left_panel_open: PanelLeftIcon,
  picture_as_pdf: PictureAsPdf,
  radio_button_unchecked: RadioButtonUnchecked,
  remove: Remove,
  search: Search,
  shield: Shield,
  upload: Upload,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 16, className = "" }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
}
