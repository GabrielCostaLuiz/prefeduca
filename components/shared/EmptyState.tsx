import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <VStack space="md" className="items-center justify-center py-10 mt-10">
      <Icon size={48} color="#9CA3AF" />
      <Text className="text-gray-500 text-center font-medium mt-4">
        {message}
      </Text>
      {actionLabel && onAction && (
        <Button onPress={onAction} className="mt-4 bg-blue-900 rounded-lg">
          <ButtonText>{actionLabel}</ButtonText>
        </Button>
      )}
    </VStack>
  );
}
