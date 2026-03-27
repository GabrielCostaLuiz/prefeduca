import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Edit2, Trash2 } from 'lucide-react-native';
import { Student } from '../student.types';
import { MenuOptions } from '@/components/shared/MenuOptions';

interface StudentCardProps {
  item: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string, name: string) => void;
}

export const StudentCard = ({ item, onEdit, onDelete }: StudentCardProps) => {
  return (
    <Box className="p-4 bg-white rounded-2xl mb-4 shadow-soft-1 border border-outline-50">
      <HStack className="justify-between items-center">
        <HStack space="md" className="items-center flex-1">
          <Box className="w-12 h-12 bg-secondary-100 rounded-2xl items-center justify-center border border-secondary-200">
            <Text className="text-black font-black text-lg">{item.callNumber}</Text>
          </Box>
          <VStack className="flex-1">
            <Heading size="md" className="text-black font-bold">{item.name}</Heading>
          </VStack>
        </HStack>
        
        <MenuOptions
          offset={4}
          buttonClassName="p-2 bg-typography-50 rounded-full"
          triggerClassName="text-typography-400"
          iconSize={20}
          options={[
            {
              key: 'edit',
              title: 'Editar Aluno',
              action: () => onEdit(item),
              icon: Edit2
            },
            {
              key: 'delete',
              title: 'Remover Aluno',
              action: () => onDelete(item.id, item.name),
              icon: Trash2,
              isDestructive: true
            }
          ]}
        />
      </HStack>
    </Box>
  );
};
