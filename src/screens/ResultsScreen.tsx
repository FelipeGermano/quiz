// ResultsScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type Props = {
    route: {
        params: {
            score: number;
            totalQuestions: number;
            timeTaken: number;
        };
    };
    navigation: any;
};

const ResultsScreen: React.FC<Props> = ({ route, navigation }) => {
    const { score, totalQuestions, timeTaken } = route.params;
    const passThreshold = Math.ceil(totalQuestions * 0.6);
    const passed = score >= passThreshold;

    return (
        <View style={styles.container}>
            <Text style={styles.resultText}>Quiz Completed!</Text>
            <Text style={styles.statText}>Score: {score} / {totalQuestions}</Text>
            <Text style={styles.statText}>Time Taken: {timeTaken} seconds</Text>
            <Text style={[styles.resultText, passed ? styles.passText : styles.failText]}>
                {passed ? 'Congratulations! You Passed!' : 'You Failed. Try Again!'}
            </Text>
            <Button title="Go to Home" onPress={() => navigation.navigate('ListQuizzes')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    resultText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 12,
        textAlign: 'center',
    },
    statText: {
        fontSize: 18,
        marginVertical: 8,
        textAlign: 'center',
    },
    passText: {
        color: '#4caf50',
    },
    failText: {
        color: '#f44336',
    },
});

export default ResultsScreen;
