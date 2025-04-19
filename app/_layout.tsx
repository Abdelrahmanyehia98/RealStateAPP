import { Stack } from 'expo-router';
import Sidebar from '../components/Sidebar'; // أو المسار حسب مكان الـ Sidebar

export default function RootLayout() {
  return (
    <>
      <Sidebar />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
