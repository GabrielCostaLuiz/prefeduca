import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSchoolStore } from '@/features/schools/school.store';
import { useClassStore } from '@/features/classes/class.store';
import { useStudentStore } from '@/features/students/student.store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

async function startMockServer() {
  if (!__DEV__) return;

  try {
    const { server } = await import('@/core/mocks/server');

    if (!server) {
      console.warn('[MSW] O objeto server não foi encontrado no módulo.');
      return;
    }

    server.listen({
      onUnhandledRequest(request, print) {
        const url = request.url;
        if (
          url.includes('/symbolicate') ||
          url.includes('/logs') ||
          url.includes('/hot') ||
          url.includes('.bundle')
        ) {
          return;
        }
        print.warning();
      },
    });

    console.log('[MSW] ✓ Mock server is running — Prefeduca Context active');
  } catch (error) {
    console.error('[MSW] Erro ao iniciar o servidor de mocks:', error);
  }
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [mockReady, setMockReady] = useState(!__DEV__);
  const [loaded, error] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!__DEV__) return;
    startMockServer().finally(() => setMockReady(true));
  }, []);

  if (!mockReady || !loaded) return null;

  return (
    <SafeAreaProvider>
      <RootLayoutNav />
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const fetchSchools = useSchoolStore((s) => s.fetchSchools);
  const fetchAllClasses = useClassStore((s) => s.fetchAllClasses);
  const fetchAllStudents = useStudentStore((s) => s.fetchAllStudents);

  useEffect(() => {
    const initData = async () => {
      try {
        await Promise.all([
          fetchSchools(),
          fetchAllClasses(),
          fetchAllStudents(),
        ]);
        console.log('[App] Data initialized successfully');
      } catch (error) {
        console.error('[App] Failed to initialize data:', error);
      }
    };

    initData();
  }, [fetchSchools, fetchAllClasses, fetchAllStudents]);

  const LightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#1e40af',
      background: '#f9fafb',
    },
  };

  return (
    <GluestackUIProvider mode="light">
      <ThemeProvider value={LightTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: LightTheme.colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
