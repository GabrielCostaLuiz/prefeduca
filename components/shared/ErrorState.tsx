import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { TriangleAlert } from 'lucide-react-native';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <VStack space="md" className="items-center justify-center py-10 mt-10">
      <TriangleAlert size={48} color="#EF4444" />
      <Text className="text-red-500 text-center font-bold mt-4">{message}</Text>
      <Button
        onPress={onRetry}
        className="mt-4 bg-red-100 rounded-lg"
        variant="solid"
      >
        <ButtonText className="text-red-600">Tentar novamente</ButtonText>
      </Button>
    </VStack>
  );
}
