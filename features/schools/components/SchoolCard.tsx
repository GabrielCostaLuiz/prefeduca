import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Badge, BadgeText } from '@/components/ui/badge';
import React from 'react';
import { Pressable } from 'react-native';
import { Edit2, Trash2 } from 'lucide-react-native';
import { VStack } from '@/components/ui/vstack';
import { MenuOptions } from '@/components/shared/MenuOptions';

interface SchoolCardProps {
  name: string;
  address: string;
  classCount: number;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SchoolCard({ name, address, classCount, onPress, onEdit, onDelete }: SchoolCardProps) {
  return (
    <Box className="p-5 bg-white rounded-2xl shadow-soft-1 border border-outline-50">
      <HStack className="justify-between items-center">
        <Pressable onPress={onPress} className="flex-1 mr-3">
          <VStack>
            <Heading size="md" className="text-typography-900 font-bold mb-1">
              {name}
            </Heading>
            <Text size="sm" className="text-typography-500 line-clamp-1">
              {address}
            </Text>
          </VStack>
        </Pressable>
        <HStack space="md" className="items-center">
          <Badge action="info" variant="solid" className="rounded-full px-3 py-1 ">
            <BadgeText className=" text-xs font-bold leading-tight">{classCount} Turmas</BadgeText>
          </Badge>
          <MenuOptions
            offset={4}
            buttonClassName="p-2 bg-typography-50 rounded-full"
            triggerClassName="text-typography-400"
            iconSize={20}
            options={[
              {
                key: 'edit',
                title: 'Editar Unidade',
                action: onEdit,
                icon: Edit2
              },
              {
                key: 'delete',
                title: 'Excluir Unidade',
                action: onDelete,
                icon: Trash2,
                isDestructive: true
              }
            ]}
          />
        </HStack>
      </HStack>
    </Box>
  );
}
