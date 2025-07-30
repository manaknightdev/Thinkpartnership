import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import API_CONFIG from "@/config/api";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// Custom ProfileAvatar component for consistent profile picture handling
interface ProfileAvatarProps {
  photo?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  photo,
  alt = "Profile",
  size = 'md',
  className
}) => {
  const [imageError, setImageError] = React.useState(false);

  const getImageSrc = (photoUrl: string) => {
    return photoUrl.startsWith('http') ? photoUrl : `${API_CONFIG.BASE_URL}${photoUrl}`;
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {photo && !imageError && (
        <AvatarImage
          src={getImageSrc(photo)}
          alt={alt}
          onError={() => setImageError(true)}
        />
      )}
      <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-200">
        <User className={cn(iconSizes[size], "text-green-600")} />
      </AvatarFallback>
    </Avatar>
  );
};

export { Avatar, AvatarImage, AvatarFallback };
