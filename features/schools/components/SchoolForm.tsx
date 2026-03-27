import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Input,  InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
});

type FormData = z.infer<typeof schema>;

interface SchoolFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function SchoolForm({ initialData, onSubmit, isSubmitting }: SchoolFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
    },
  });

  return (
    <VStack space="lg">
      <FormControl isInvalid={!!errors.name}>
        <FormControlLabel>
          <FormControlLabelText>Nome da Escola</FormControlLabelText>
        </FormControlLabel>
        <Input variant="outline" size="md">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                placeholder="Ex: Escola Municipal João de Barro"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Input>
        <FormControlError>
          <FormControlErrorText>{errors.name?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={!!errors.address}>
        <FormControlLabel>
          <FormControlLabelText>Endereço Completo</FormControlLabelText>
        </FormControlLabel>
        <Input variant="outline" size="md">
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                placeholder="Ex: Rua das Flores, 123 - Centro"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Input>
        <FormControlError>
          <FormControlErrorText>{errors.address?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <Button 
        onPress={handleSubmit(onSubmit)} 
        disabled={isSubmitting}
        className="bg-primary-0 mt-4 h-12 rounded-xl"
      >
        {isSubmitting ? (
          <ButtonSpinner />
        ) : (
          <ButtonText className="font-bold text-lg">Salvar Escola</ButtonText>
        )}
      </Button>
    </VStack>
  );
}
