import { ExpoRouter } from "expo-router";
import "react-native-reanimated";
import { useEffect } from "react";
import { testFirebaseConnection } from "./firebase";
import { initializeSampleProperties } from "./services/firestore";
import { sampleProperties } from "./data/sampleProperties";

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Test Firebase connection
        const success = await testFirebaseConnection();

        if (success) {
          console.log("Firebase connection test passed!");

          try {
            // Initialize sample properties in Firestore with retry mechanism
            console.log("Attempting to initialize sample properties...");
            await initializeSampleProperties(sampleProperties);
            console.log("Sample properties initialization complete");
          } catch (firestoreError) {
            console.error("Error initializing sample properties:", firestoreError);

            // Try again with a single property if batch fails
            try {
              console.log("Attempting to add a single sample property...");
              const { addProperty } = require('./services/firestore');
              await addProperty(sampleProperties[0]);
              console.log("Successfully added a single sample property");
            } catch (singlePropertyError) {
              console.error("Failed to add single property:", singlePropertyError);
            }
          }
        } else {
          console.error("Firebase connection test failed!");
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initializeApp();
  }, []);

  return <ExpoRouter.Root />;
}


