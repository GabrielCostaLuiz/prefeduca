import { Box } from '../ui/box';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Box
        className={`container mx-auto mt-2 px-4 pb-1 bg-slate-100 flex-1 pt-2  ${className}`}
      >
        {children}
      </Box>
    </SafeAreaView>
  );
}
