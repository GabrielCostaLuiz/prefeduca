import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from 'react-native';
import { Badge, BadgeText } from '@/components/ui/badge';
import { MenuOptions } from '@/components/shared/MenuOptions';
import { Edit2, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { Class } from '../class.types';

interface ClassCardProps {
  item: Class;
  onEdit: (item: Class) => void;
  onDelete: (id: string) => void;
}

export const ClassCard = ({ item, onEdit, onDelete }: ClassCardProps) => {
  return (
        <Pressable 
          onPress={() => router.push(`/schools/${item.schoolId}/classes/${item.id}`)}
        >
    <Box className="p-5 bg-white rounded-2xl shadow-soft-1 border border-outline-50">
      <HStack className="justify-between items-center">
          <VStack className="flex-1 mr-3">
            {item.schoolName && (
              <Text size="xs" className="text-primary-600 font-bold uppercase mb-1">
                {item.schoolName}
              </Text>
            )}
            <Heading size="md" className="text-typography-900 font-bold mb-1">
               {item.name}
            </Heading>
            <Text size="sm" className="text-typography-500 line-clamp-1">
              Sala: {item.room}
            </Text>
          </VStack>
        
        <HStack space="md" className="items-center">
          <Badge action="info" variant="solid" className="rounded-full px-3 py-1 ">
            <BadgeText className=" text-xs font-bold leading-tight">{item.studentsCount} Alunos</BadgeText>
          </Badge>
          <MenuOptions
            offset={4}
            buttonClassName="p-2 bg-typography-50 rounded-full"
            triggerClassName="text-typography-400"
            iconSize={20}
            options={[
              {
                key: 'edit',
                title: 'Editar Turma',
                action: () => onEdit(item),
                icon: Edit2
              },
              {
                key: 'delete',
                title: 'Excluir Turma',
                action: () => onDelete(item.id),
                icon: Trash2,
                isDestructive: true
              }
            ]}
          />
        </HStack>
      </HStack>
    </Box>
        </Pressable>
  );
};
