import React from 'react';
import {
  Utensils,
  Hotel,
  Scissors,
  ShoppingBag,
  Bike,
  Headphones,
  GraduationCap,
  Briefcase,
  Code,
  Wrench,
  ShieldCheck,
  Store,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name?.toLowerCase()) {
    case 'utensils':
    case 'restaurant':
    case 'cafe':
      return <Utensils {...props} />;
    case 'hotel':
    case 'hospitality':
      return <Hotel {...props} />;
    case 'scissors':
    case 'salon':
    case 'beauty':
      return <Scissors {...props} />;
    case 'shoppingbag':
    case 'shopping-bag':
    case 'retail':
    case 'shop':
      return <ShoppingBag {...props} />;
    case 'bike':
    case 'delivery':
    case 'logistics':
      return <Bike {...props} />;
    case 'headphones':
    case 'customer-service':
    case 'support':
      return <Headphones {...props} />;
    case 'graduationcap':
    case 'graduation-cap':
    case 'education':
    case 'tutoring':
      return <GraduationCap {...props} />;
    case 'briefcase':
    case 'office':
    case 'admin':
      return <Briefcase {...props} />;
    case 'code':
    case 'software':
    case 'it':
      return <Code {...props} />;
    case 'wrench':
    case 'housekeeping':
    case 'maintenance':
      return <Wrench {...props} />;
    case 'shieldcheck':
    case 'shield-check':
    case 'security':
      return <ShieldCheck {...props} />;
    case 'store':
    case 'local-business':
    case 'business':
      return <Store {...props} />;
    default:
      return <Briefcase {...props} />;
  }
};
