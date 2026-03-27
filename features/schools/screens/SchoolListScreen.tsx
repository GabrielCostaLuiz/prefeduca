import { Box } from '@/components/ui/box';
import { useSchoolStore } from '../school.store';
import { School } from '../school.types';
import { SchoolCard } from '../components/SchoolCard';
import { SchoolForm } from '../components/SchoolForm';
import { router } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import {
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { PlusIcon, MapIcon } from 'lucide-react-native';
import Container from '@/components/layout/Container';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { SearchInput } from '@/components/shared/SearchInput';
import { AppModal } from '@/components/shared/AppModal';
import { ListHeader } from '@/components/shared/ListHeader';
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
import { ChevronDownIcon, SortAscIcon } from 'lucide-react-native';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export type SortOrder =
  | 'name-asc'
  | 'name-desc'
  | 'classes-desc'
  | 'classes-asc';

export function SchoolListScreen() {
  const {
    schools,
    isLoading,
    error,
    fetchSchools,
    addSchool,
    deleteSchool,
    updateSchool,
  } = useSchoolStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('name-asc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const processedSchools = useMemo(() => {
    let result = [...schools];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (s: School) =>
          s.name.toLowerCase().includes(lowerQuery) ||
          s.address.toLowerCase().includes(lowerQuery),
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
      if (sortOrder === 'classes-desc') return b.classCount - a.classCount;
      if (sortOrder === 'classes-asc') return a.classCount - b.classCount;
      return 0;
    });

    return result;
  }, [schools, searchQuery, sortOrder]);

  const handleCreateSchool = async (
    data: Omit<School, 'id' | 'classCount'>,
  ) => {
    setIsSubmitting(true);
    await addSchool(data);
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleCreateOrUpdateSchool = async (
    data: Omit<School, 'id' | 'classCount'>,
  ) => {
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
    Alert.alert(
      'Excluir Escola',
      'Tem certeza que deseja excluir esta unidade?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteSchool(id);
          },
        },
      ],
    );
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

      <VStack space="md" className="mb-6">
        <HStack space="sm" className="items-center">
          <Box className="flex-1">
            <SearchInput
              placeholder="Buscar por nome ou endereço..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Box>
          <Box className="w-16">
            <Select
              onValueChange={(val) => setSortOrder(val as SortOrder)}
              selectedValue={sortOrder}
            >
              <SelectTrigger
                variant="outline"
                size="md"
                className="rounded-xl border-outline-200 bg-white h-12 w-14 justify-center items-center"
              >
                <SelectIcon as={SortAscIcon} className="text-typography-500" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent className="rounded-t-3xl">
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Nome (A-Z)" value="name-asc" />
                  <SelectItem label="Nome (Z-A)" value="name-desc" />
                  <SelectItem label="Mais Turmas" value="classes-desc" />
                  <SelectItem label="Menos Turmas" value="classes-asc" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </Box>
        </HStack>
      </VStack>

      {isLoading && schools.length === 0 ? (
        <Box className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1e40af" />
        </Box>
      ) : (
        <FlatList
          data={processedSchools}
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
              message={
                searchQuery
                  ? 'Nenhuma escola encontrada para esta busca.'
                  : 'Nenhuma escola cadastrada ainda.'
              }
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
        title={editingSchool ? 'Editar Unidade' : 'Nova Unidade'}
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
