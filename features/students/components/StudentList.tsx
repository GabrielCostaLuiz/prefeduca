import { Box } from '@/components/ui/box';
import { Student } from '../student.types';
import { StudentCard } from './StudentCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { User } from 'lucide-react-native';

interface StudentListProps {
  data: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string, name: string) => void;
  searchQuery: string;
}

export const StudentList = ({ data, onEdit, onDelete, searchQuery }: StudentListProps) => {
  if (data.length === 0) {
    return (
      <EmptyState
        icon={User}
        message={searchQuery ? "Nenhum aluno encontrado para esta busca." : "Nenhum aluno cadastrado nesta turma."}
      />
    );
  }

  return (
    <Box className="mt-2">
      {data.map((item) => (
        <StudentCard 
          key={item.id} 
          item={item} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </Box>
  );
};
