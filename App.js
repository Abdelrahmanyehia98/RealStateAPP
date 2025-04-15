import { ExpoRouter } from "expo-router";
import "react-native-reanimated";
import Sidebar from "./components/Sidebar";

export default function App() {
  return <>
  <Sidebar/>
  <ExpoRouter.Root />
  </>;
}


