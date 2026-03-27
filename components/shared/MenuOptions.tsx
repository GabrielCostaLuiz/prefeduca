import React from 'react';
import { Pressable } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { ButtonIcon } from '@/components/ui/button';

export interface MenuOption {
  key: string;
  title: string;
  action: () => void;
  icon: any;
  isDestructive?: boolean;
}

interface MenuOptionsProps {
  options: MenuOption[];
  triggerClassName?: string;
  buttonClassName?: string;
  iconSize?: number;
  offset?: number;
}

export const MenuOptions = ({ 
  options, 
  triggerClassName = "text-secondary-900", 
  buttonClassName = "",
  iconSize = 24, 
  offset = 8 
}: MenuOptionsProps) => {
  return (
    <Menu
      offset={offset}
      trigger={({ ...triggerProps }) => (
        <Pressable {...triggerProps} className={buttonClassName}>
          <MoreVertical size={iconSize} className={triggerClassName} />
        </Pressable>
      )}
    >
      {options.map((option) => (
        <MenuItem 
          key={option.key} 
          textValue={option.title}
          onPress={option.action}
        >
          <ButtonIcon 
            as={option.icon} 
            className={`mr-2 ${option.isDestructive ? "text-error-500" : "text-typography-500"}`} 
            size="sm" 
          />
          <MenuItemLabel 
            size="sm" 
            className={option.isDestructive ? "text-error-500" : "text-typography-700"}
          >
            {option.title}
          </MenuItemLabel>
        </MenuItem>
      ))}
    </Menu>
  );
};
