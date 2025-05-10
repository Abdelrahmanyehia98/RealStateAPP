import { Stack } from 'expo-router';
import Sidebar from '../components/Sidebar';
import FontLoader from '../assets/components/FontLoader';

export default function RootLayout() {
  return (
    <FontLoader>
      <>
        <Sidebar />
        <Stack screenOptions={{ headerShown: false }} />
      </>
    </FontLoader>
  );
}
