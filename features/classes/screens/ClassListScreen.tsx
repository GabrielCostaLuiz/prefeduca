import { Box } from '@/components/ui/box';
import { Class } from '../class.types';
import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  PlusIcon,
  UsersIcon,
  ChevronDownIcon,
  XIcon,
} from 'lucide-react-native';
import Container from '@/components/layout/Container';
import { ListHeader } from '@/components/shared/ListHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { SearchInput } from '@/components/shared/SearchInput';
import { AppModal } from '@/components/shared/AppModal';
import { ClassForm, ClassFormValues } from '../components/ClassForm';

import { ClassCard } from '../components/ClassCard';
import { useSchoolStore } from '../../schools/school.store';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from '@/components/ui/select';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonIcon } from '@/components/ui/button';
import { useClassStore } from '../class.store';
import { useStudentStore } from '../../students/student.store';

export function ClassListScreen() {
  const {
    classes,
    isLoading,
    error,
    fetchAllClasses,
    addClass,
    updateClass,
    deleteClass,
  } = useClassStore();
  const { schools: allSchools, fetchSchools: fetchAllSchoolsData } = useSchoolStore();
  const { students } = useStudentStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('all');
  const [selectedShift, setSelectedShift] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllSchoolsData();
  }, [fetchAllSchoolsData]);

  useFocusEffect(
    useCallback(() => {
      fetchAllClasses();
    }, [fetchAllClasses]),
  );

  const filteredClasses = useMemo(() => {
    let result = classes.map((c: Class) => ({
      ...c,
      studentsCount: students.filter(s => s.classId === c.id).length
    }));

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (c: Class) =>
          c.name.toLowerCase().includes(lowerQuery) ||
          c.room.toLowerCase().includes(lowerQuery),
      );
    }

    if (selectedSchoolId !== 'all') {
      result = result.filter((c: Class) => c.schoolId === selectedSchoolId);
    }

    if (selectedShift !== 'all') {
      result = result.filter((c: Class) => c.shift === selectedShift);
    }

    return result;
  }, [classes, students, searchQuery, selectedSchoolId, selectedShift]);

  const handleCreateOrUpdateClass = async (data: ClassFormValues) => {
    setIsSubmitting(true);
    if (editingClass) {
      await updateClass(editingClass.id, data);
    } else {
      await addClass(data.schoolId, data);
    }
    setIsSubmitting(false);
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleEdit = (clazz: Class) => {
    setEditingClass(clazz);
    setIsModalOpen(true);
  };

  const handleDelete = (classId: string) => {
    Alert.alert('Excluir Turma', 'Deseja remover esta turma permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteClass(classId);
        },
      },
    ]);
  };

  if (error && classes.length === 0) {
    return (
      <Container>
        <ErrorState message={error} onRetry={fetchAllClasses} />
      </Container>
    );
  }

  return (
    <Container>
      <ListHeader
        title="Turmas"
        subtitle="Listagem global de todas as unidades"
        onActionPress={() => {
          setEditingClass(null);
          setIsModalOpen(true);
        }}
        actionIcon={PlusIcon}
      />

      <VStack space="md" className="mb-6">
        <SearchInput
          placeholder="Buscar por nome ou sala..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <HStack space="sm" className="items-center">
          <Box className="flex-1">
            <Select
              key={`school-select-${selectedSchoolId}`}
              onValueChange={setSelectedSchoolId}
              selectedValue={selectedSchoolId}
            >
              <SelectTrigger
                variant="outline"
                size="md"
                className="rounded-xl border-outline-200 bg-white h-12"
              >
                <SelectInput
                  placeholder="Todas Unidades"
                  value={
                    selectedSchoolId === 'all'
                      ? 'Todas Unidades'
                      : allSchools.find((s) => s.id === selectedSchoolId)?.name
                  }
                />
                <SelectIcon
                  className="mr-3 text-typography-400"
                  as={ChevronDownIcon}
                />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent className="rounded-t-3xl">
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Todas Unidades" value="all" />
                  {allSchools.map((school) => (
                    <SelectItem
                      key={school.id}
                      label={school.name}
                      value={school.id}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </Box>

          <Box className="flex-1">
            <Select
              key={`shift-select-${selectedShift}`}
              onValueChange={setSelectedShift}
              selectedValue={selectedShift}
            >
              <SelectTrigger
                variant="outline"
                size="md"
                className="rounded-xl border-outline-200 bg-white h-12"
              >
                <SelectInput
                  placeholder="Todos Turnos"
                  value={
                    selectedShift === 'all' ? 'Todos Turnos' : selectedShift
                  }
                />
                <SelectIcon
                  className="mr-3 text-typography-400"
                  as={ChevronDownIcon}
                />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent className="rounded-t-3xl">
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Todos Turnos" value="all" />
                  <SelectItem label="Matutino" value="Matutino" />
                  <SelectItem label="Vespertino" value="Vespertino" />
                  <SelectItem label="Noturno" value="Noturno" />
                  <SelectItem label="Integral" value="Integral" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </Box>

          {(selectedSchoolId !== 'all' ||
            selectedShift !== 'all' ||
            searchQuery !== '') && (
            <Button
              variant="solid"
              action="secondary"
              className="h-12 w-12 p-0 justify-center items-center rounded-xl bg-typography-100"
              onPress={() => {
                setSelectedSchoolId('all');
                setSelectedShift('all');
                setSearchQuery('');
              }}
            >
              <ButtonIcon as={XIcon} className="text-typography-600" />
            </Button>
          )}
        </HStack>
      </VStack>

      {isLoading && classes.length === 0 ? (
        <Box className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1e40af" />
        </Box>
      ) : (
        <FlatList
          data={filteredClasses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ItemSeparatorComponent={() => <Box className="h-4" />}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchAllClasses}
              colors={['#1e40af']}
            />
          }
          renderItem={({ item }) => (
            <ClassCard
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={UsersIcon}
              message={
                searchQuery
                  ? 'Nenhuma turma encontrada para esta busca.'
                  : 'Nenhuma turma cadastrada no sistema.'
              }
            />
          }
        />
      )}

      <AppModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClass(null);
        }}
        title={editingClass ? 'Editar Turma' : 'Nova Turma'}
      >
        <ClassForm
          initialData={editingClass || undefined}
          onSubmit={handleCreateOrUpdateClass}
          isSubmitting={isSubmitting}
        />
      </AppModal>
    </Container>
  );
}
