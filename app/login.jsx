import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase.js"

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null)


    const isStrongPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };
    const handleLogin = () => {

        if (!email.trim() || !password.trim()) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        if (!isStrongPassword(password)) {
            setErrorMessage("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
            return;
        }

        setIsLoading(true);


        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                 
                const user = userCredential.user;
                
                console.log("45" + user);

            })
            .catch((error) => {
                const errorCode = error.code;
                setErrorMessage(error.message);

            }).finally(() => {
                setIsLoading(false);
                router.replace("/");

            });;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >

            <View style={styles.innerContainer}>
                <Text style={styles.title}>Login Now:</Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="alex@mail.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    accessibilityLabel="Email input"

                />

                <Text style={styles.label}>Password</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    accessibilityLabel="Password input"
                />

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            (isLoading || !email || !password) && styles.disabledButton
                        ]}

                        onPress={handleLogin}
                        disabled={isLoading || !email || !password}
                        accessibilityRole="button"
                    >
                        <Text style={styles.buttonText}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.registerLinkContainer}>
                    <Text style={styles.signUpText}>If you don't have an account, </Text>
                    <Pressable onPress={() => router.push("/signup")}>
                        <Text style={styles.signUpLink}>Register Now</Text>
                    </Pressable>
                </View>



                {errorMessage ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                ) : null}

            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    registerLinkContainer: {
        width: "100%",

        flexDirection: "row",

        alignItems: 'center',
        marginVertical:10,
        gap: 4,

    },
    errorContainer: {
        backgroundColor: "#f8b4b453",
        borderRadius: 8,
        padding: 20,
        marginTop: 15,
        width: "100%",
        borderWidth: 1,
        borderColor: "rgb(248 180 180)",
    },

    errorText: {
        color: "#9b1c1cef",
        fontSize: 16,
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        lineHeight: 20,
        color: "#210800",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",

    },
    innerContainer: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#000",
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#f9fafb",
        borderColor: "#d1d5db",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        color: "#757575",
        fontSize: 16,
    },
    btnContainer: {
        width: "100%",
        alignItems: "flex-end",

    },
    button: {
        borderWidth: 1,
        borderColor: '#1c9b25ef',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: 'white',

    },
    disabledButton: {
        // backgroundColor: "#555",
        // borderColor: "#777",
        opacity: 0.3,
    },
    buttonText: {
        color: '#1c9b25ef',
        fontSize: 18,
        // fontWeight: "bold",
    },
    signUpLink: {
        // marginTop: 20,
        color: "#1c9b25ef",
    },
    signUpText: {
        color: "#210800",
        fontSize: 14,
    },
});
