/**
 * Material UI "Rounded" (filled) icons, wrapped to accept Lucide-style props.
 * Mirrors the pattern used in The-ALANA-Project/CreatorBrandingStudio.
 * strokeWidth is accepted but ignored — filled icons have no stroke.
 */
import type { SvgIconProps } from "@mui/material";
import type { ComponentType, CSSProperties } from "react";

import AddRounded from "@mui/icons-material/AddRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import BoltRounded from "@mui/icons-material/BoltRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import CircleRounded from "@mui/icons-material/CircleRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ConstructionRounded from "@mui/icons-material/ConstructionRounded";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import DescriptionRounded from "@mui/icons-material/DescriptionRounded";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import DragIndicatorRounded from "@mui/icons-material/DragIndicatorRounded";
import ExpandLessRounded from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import ImageRounded from "@mui/icons-material/ImageRounded";
import InfoRounded from "@mui/icons-material/InfoRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowLeftRounded from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRounded from "@mui/icons-material/KeyboardArrowRightRounded";
import KeyboardArrowUpRounded from "@mui/icons-material/KeyboardArrowUpRounded";
import MenuBookRounded from "@mui/icons-material/MenuBookRounded";
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import PaletteRounded from "@mui/icons-material/PaletteRounded";
import PictureAsPdfRounded from "@mui/icons-material/PictureAsPdfRounded";
import RadioButtonUncheckedRounded from "@mui/icons-material/RadioButtonUncheckedRounded";
import RemoveRounded from "@mui/icons-material/RemoveRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import ShieldRounded from "@mui/icons-material/ShieldRounded";
import UploadRounded from "@mui/icons-material/UploadRounded";
import ViewSidebarRounded from "@mui/icons-material/ViewSidebarRounded";

interface LucideStyleProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

function wrap(MuiIcon: ComponentType<SvgIconProps>) {
  return function WrappedIcon({ size, color, strokeWidth: _ignored, className, style, ...rest }: LucideStyleProps) {
    return (
      <MuiIcon
        className={className}
        style={{ fontSize: size ?? 24, color, ...style }}
        {...(rest as SvgIconProps)}
      />
    );
  };
}

// Navigation / chevrons
export const ChevronDown = wrap(KeyboardArrowDownRounded);
export const ChevronUp = wrap(KeyboardArrowUpRounded);
export const ChevronLeft = wrap(KeyboardArrowLeftRounded);
export const ChevronRight = wrap(KeyboardArrowRightRounded);
export const ChevronDownIcon = ChevronDown;
export const ChevronRightIcon = ChevronRight;
export const ExpandMore = wrap(ExpandMoreRounded);
export const ExpandLess = wrap(ExpandLessRounded);

// Arrows
export const ArrowLeft = wrap(ArrowBackRounded);
export const ArrowRight = wrap(ArrowForwardRounded);
export const ArrowBack = ArrowLeft;
export const ArrowForward = ArrowRight;

// Actions
export const Add = wrap(AddRounded);
export const Plus = Add;
export const Check = wrap(CheckRounded);
export const CheckIcon = Check;
export const CheckCircle2 = wrap(CheckCircleRounded);
export const Close = wrap(CloseRounded);
export const X = Close;
export const XIcon = Close;
export const Delete = wrap(DeleteRounded);
export const Trash2 = Delete;
export const Download = wrap(DownloadRounded);
export const Upload = wrap(UploadRounded);
export const Remove = wrap(RemoveRounded);
export const MinusIcon = Remove;

// File / media
export const Description = wrap(DescriptionRounded);
export const FileText = Description;
export const Image = wrap(ImageRounded);
export const FileImage = Image;
export const PictureAsPdf = wrap(PictureAsPdfRounded);
export const OpenInNew = wrap(OpenInNewRounded);
export const ExternalLink = OpenInNew;

// Navigation / places
export const Home = wrap(HomeRounded);
export const MenuBook = wrap(MenuBookRounded);
export const BookOpen = MenuBook;

// UI controls
export const Circle = wrap(CircleRounded);
export const CircleIcon = Circle;
export const RadioButtonUnchecked = wrap(RadioButtonUncheckedRounded);
export const DragIndicator = wrap(DragIndicatorRounded);
export const GripVertical = DragIndicator;
export const MoreHoriz = wrap(MoreHorizRounded);
export const MoreHorizontal = MoreHoriz;
export const Search = wrap(SearchRounded);
export const SearchIcon = Search;
export const ViewSidebar = wrap(ViewSidebarRounded);
export const PanelLeftIcon = ViewSidebar;
export const ChevronRightSmall = wrap(ChevronRightRounded);

// Thematic
export const Bolt = wrap(BoltRounded);
export const Shield = wrap(ShieldRounded);
export const Construction = wrap(ConstructionRounded);
export const Palette = wrap(PaletteRounded);
export const Info = wrap(InfoRounded);
