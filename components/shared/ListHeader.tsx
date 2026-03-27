import React from 'react';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonIcon } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react-native';

interface ListHeaderProps {
  title: string;
  subtitle?: string;
  onActionPress?: () => void;
  actionIcon?: LucideIcon;
}

export function ListHeader({ 
  title, 
  subtitle, 
  onActionPress, 
  actionIcon 
}: ListHeaderProps) {
  return (
    <HStack className="justify-between items-center">
      <Box>
        <Heading size="2xl" className="text-black font-black">
          {title}
        </Heading>
        {subtitle && (
          <Text size="sm" className="text-typography-500">
            {subtitle}
          </Text>
        )}
      </Box>
      {onActionPress && actionIcon && (
        <Button
          size="sm"
          onPress={onActionPress}
          className="bg-primary-0 rounded-full h-10 w-10 items-center justify-center shadow-md active:opacity-80"
        >
          <ButtonIcon as={actionIcon} color="white" size="xl" />
        </Button>
      )}
    </HStack>
  );
}
