import { Box } from '@/components/ui/box';
import { useSchoolStore } from '../school.store';
import { School } from '../school.types';
import { SchoolCard } from '../components/SchoolCard';
import { SchoolForm } from '../components/SchoolForm';
import { router } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { PlusIcon, MapIcon } from 'lucide-react-native';
import Container from '@/components/layout/Container';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { SearchInput } from '@/components/shared/SearchInput';
import { AppModal } from '@/components/shared/AppModal';
import { ListHeader } from '@/components/shared/ListHeader';

export function SchoolListScreen() {
  const { schools, isLoading, error, fetchSchools, addSchool, deleteSchool, updateSchool } = useSchoolStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const filteredSchools = useMemo(() => {
    if (!searchQuery) return schools;
    const lowerQuery = searchQuery.toLowerCase();
    return schools.filter((s: School) => 
      s.name.toLowerCase().includes(lowerQuery) || 
      s.address.toLowerCase().includes(lowerQuery)
    );
  }, [schools, searchQuery]);

  const handleCreateSchool = async (data: Omit<School, 'id' | 'classCount'>) => {
    setIsSubmitting(true);
    await addSchool(data);
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleCreateOrUpdateSchool = async (data: Omit<School, 'id' | 'classCount'>) => {
    setIsSubmitting(true);
    if (editingSchool) {
      await updateSchool(editingSchool.id, data);
    } else {
      await addSchool(data);
    }
    setIsSubmitting(false);
    setIsModalOpen(false);
    setEditingSchool(null);
  };

  const handleEdit = (school: School) => {
    setEditingSchool(school);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Excluir Escola', 'Tem certeza que deseja excluir esta unidade?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        await deleteSchool(id);
      }},
    ]);
  };

  if (error && schools.length === 0) {
    return (
      <Container>
        <ErrorState message={error} onRetry={fetchSchools} />
      </Container>
    );
  }

  return (
    <Container>
      <ListHeader 
        title="Escolas" 
        subtitle="Gerenciamento de unidades escolares" 
        onActionPress={() => {
          setEditingSchool(null);
          setIsModalOpen(true);
        }} 
        actionIcon={PlusIcon} 
      />

      <SearchInput 
        placeholder="Buscar por nome ou endereço..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {isLoading && schools.length === 0 ? (
        <Box className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1e40af" />
        </Box>
      ) : (
        <FlatList
          data={filteredSchools}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ItemSeparatorComponent={() => <Box className="h-4" />}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchSchools}
              colors={['#1e40af']}
            />
          }
          renderItem={({ item }) => (
            <SchoolCard
              name={item.name}
              address={item.address}
              classCount={item.classCount}
              onPress={() => router.push(`/schools/${item.id}`)}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={MapIcon}
              message={searchQuery ? "Nenhuma escola encontrada para esta busca." : "Nenhuma escola cadastrada ainda."}
            />
          }
        />
      )}

      <AppModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingSchool(null);
        }} 
        title={editingSchool ? "Editar Unidade" : "Nova Unidade"}
      >
        <SchoolForm 
          initialData={editingSchool || undefined} 
          onSubmit={handleCreateOrUpdateSchool} 
          isSubmitting={isSubmitting} 
        />
      </AppModal>
    </Container>
  );
}
