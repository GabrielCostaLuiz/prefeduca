import React from 'react';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { MenuOptions, MenuOption } from './MenuOptions';

interface DetailHeaderProps {
  title: string;
  onBack: () => void;
  options?: MenuOption[];
}

export const DetailHeader = ({ title, onBack, options }: DetailHeaderProps) => {
  return (
    <HStack className="items-center py-3 border-b border-outline-50 px-1">
      <Pressable onPress={onBack} className="mr-4">
        <ChevronLeft size={28} className="text-black" />
      </Pressable>
      <Box className="flex-1">
        <Heading size="lg" className="text-black font-black" numberOfLines={1}>
          {title}
        </Heading>
      </Box>
      {options && options.length > 0 && (
        <MenuOptions
          offset={8}
          triggerClassName="text-black"
          options={options}
        />
      )}
    </HStack>
  );
};
