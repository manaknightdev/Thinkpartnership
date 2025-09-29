import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Crown } from "lucide-react";

interface PromotionBadgeProps {
  variant?: 'featured' | 'promoted' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PromotionBadge = ({ variant = 'promoted', size = 'md', className = '' }: PromotionBadgeProps) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'featured':
        return {
          icon: Star,
          text: 'Featured',
          className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg'
        };
      case 'premium':
        return {
          icon: Crown,
          text: 'Premium',
          className: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg'
        };
      default: // promoted
        return {
          icon: TrendingUp,
          text: 'Promoted',
          className: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg'
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          badgeClass: 'text-xs px-2 py-1',
          iconSize: 'h-3 w-3'
        };
      case 'lg':
        return {
          badgeClass: 'text-sm px-3 py-1.5',
          iconSize: 'h-4 w-4'
        };
      default: // md
        return {
          badgeClass: 'text-xs px-2.5 py-1',
          iconSize: 'h-3.5 w-3.5'
        };
    }
  };

  const variantConfig = getVariantConfig();
  const sizeConfig = getSizeConfig();
  const IconComponent = variantConfig.icon;

  return (
    <Badge 
      className={`
        ${variantConfig.className} 
        ${sizeConfig.badgeClass} 
        font-semibold 
        flex items-center gap-1 
        animate-pulse
        ${className}
      `}
    >
      <IconComponent className={sizeConfig.iconSize} />
      {variantConfig.text}
    </Badge>
  );
};

export default PromotionBadge;
