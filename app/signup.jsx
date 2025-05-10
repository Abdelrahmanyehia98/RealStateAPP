import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase.js"

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successed, setSuccessed] = useState(false);




    const isStrongPassword = (password) => {

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        return regex.test(password);
    };
    const handleSignUp = () => {
        console.log(`Creating user with:${email}${password}`);
        setErrorMessage(null);
        setSuccessed(false);

        const nameRegex = /^[a-zA-Z\s]{3,}$/;
        if (!nameRegex.test(name.trim())) {
            setErrorMessage("Please enter a valid name (letters only, at least 3 characters).");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        const phoneRegex = /^\+\d{10,14}$/;
        if (!phoneRegex.test(phone.trim())) {
            setErrorMessage("Please enter a valid phone number with country code (e.g. +201234567890).");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        if (!isStrongPassword(password)) {
            setErrorMessage("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
            return;
        }

        setIsLoading(true);


        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                setSuccessed(true);
                setErrorMessage(null);
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    setErrorMessage("This email is already registered. Please login or use another email.");
                } else {
                    setErrorMessage(error.message);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };




    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >

            <View style={styles.innerContainer}>
                <Text style={styles.title}>Register Now:
                </Text>


                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Alex Barker"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    keyboardType="default"
                    accessibilityLabel="Email input"
                />

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
                    placeholder="********"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    accessibilityLabel="Password input"
                />
                <Text style={styles.label}>rePassword</Text>

                <TextInput
                    style={styles.input}
                    placeholder="********"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    accessibilityLabel="Confirm password input"
                />
                <Text style={styles.label}>phoneNumber</Text>

                <TextInput
                    style={styles.input}
                    placeholder="+## ##########"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={15}

                />
                <View style={styles.btnContainer}>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            (isLoading || !email || !password || !confirmPassword) && styles.disabledButton
                        ]}
                        onPress={handleSignUp}
                        disabled={isLoading || !email || !password || !confirmPassword}
                        accessibilityRole="button"
                    >
                        <Text style={styles.buttonText}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.loginLinkContainer}>

                    <Text style={styles.loginText}>Already have an account? </Text>

                    <Pressable
                        onPress={() => router.push("/login")}
                    ><Text style={styles.loginLink}>Login</Text></Pressable>

                </View>


                <View >
                    {errorMessage ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    ) : null}
                    {successed ? (
                        <View style={styles.successContainer}>
                            <TouchableOpacity onPress={() => router.replace('/login')}>
                                <Text style={styles.successText}>
                                    Success alert! now you can Login
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}



                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    loginLinkContainer: {
        width: "100%",
   
        flexDirection: "row",

        alignItems: 'center',

    },
    successContainer: {
        backgroundColor: "#b4f8c153",
        borderRadius: 8,
        padding: 20,
        marginVertical: 15,
        width: "100%",
        borderWidth: 1,
        borderColor: "rgb(180, 248, 193)",

    },

    successText: {
        color: "#1c9b25ef", 
        fontSize: 16,
        textAlign: "center",

    },

    errorContainer: {
        backgroundColor: "#f8b4b453",
        borderRadius: 8,
        padding: 20,
        marginVertical: 15,
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

    loginLink: {
        // marginTop: 20,
        color: "#1c9b25ef",
    },
    loginText: {
        color: "#210800",
        fontSize: 14,
    },

});
