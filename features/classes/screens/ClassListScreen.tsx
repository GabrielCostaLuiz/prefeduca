import { Box } from '@/components/ui/box';
import { useClassStore } from '../class.store';
import { Class } from '../class.types';
import { useState, useMemo, useCallback } from 'react';
import { FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PlusIcon, UsersIcon } from 'lucide-react-native';
import Container from '@/components/layout/Container';
import { ListHeader } from '@/components/shared/ListHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { SearchInput } from '@/components/shared/SearchInput';
import { AppModal } from '@/components/shared/AppModal';
import { ClassForm } from '../components/ClassForm';
import { ClassCard } from '../components/ClassCard';

export function ClassListScreen() {
  const { classes, isLoading, error, fetchAllClasses, addClass, updateClass, deleteClass } = useClassStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchAllClasses();
    }, [fetchAllClasses])
  );

  const filteredClasses = useMemo(() => {
    if (!searchQuery) return classes;
    const lowerQuery = searchQuery.toLowerCase();
    return classes.filter((c: Class) => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.room.toLowerCase().includes(lowerQuery)
    );
  }, [classes, searchQuery]);

  const handleCreateOrUpdateClass = async (data: Omit<Class, 'id' | 'studentsCount'>) => {
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
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        await deleteClass(classId);
      }},
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

      <SearchInput 
        placeholder="Buscar por nome ou sala..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

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
              message={searchQuery ? "Nenhuma turma encontrada para esta busca." : "Nenhuma turma cadastrada no sistema."}
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
        title={editingClass ? "Editar Turma" : "Nova Turma"}
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
