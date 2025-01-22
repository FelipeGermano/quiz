import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

type Question = {
    question: string;
    correctAnswer: string;
    options: string[];
};

type Props = {
    route: {
        params: {
            quizId: number;
        };
    };
    navigation: any;
};

const openDatabase = async (): Promise<SQLiteDatabase> => {
    return SQLite.openDatabase({ name: 'quizApp.db', location: 'default' });
};

const StartQuizScreen: React.FC<Props> = ({ route, navigation }) => {
    const { quizId } = route.params;
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
        loadQuestions();
        setStartTime(Date.now());
    }, []);

    const loadQuestions = async () => {
        try {
            const db = await openDatabase();
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM questions WHERE quiz_id = ?',
                    [quizId],
                    (tx, results) => {
                        const rows = results.rows;
                        const loadedQuestions: Question[] = [];
                        for (let i = 0; i < rows.length; i++) {
                            const item = rows.item(i);
                            loadedQuestions.push({
                                question: item.question,
                                correctAnswer: item.correct_answer,
                                options: [item.option1, item.option2, item.option3, item.option4],
                            });
                        }
                        setQuestions(loadedQuestions);
                    }
                );
            });
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    };

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswers([...selectedAnswers, answer]);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        if (!startTime) return;

        const correctAnswersCount = selectedAnswers.reduce((count, answer, index) => {
            return count + (answer === questions[index].correctAnswer ? 1 : 0);
        }, 0);
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);

        try {
            const db = await openDatabase();
            db.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO results (quiz_id, score, time_taken, created_at) VALUES (?, ?, ?, ?)',
                    [quizId, correctAnswersCount, timeTaken, new Date().toISOString()]
                );
            });

            navigation.navigate('Results', {
                score: correctAnswersCount,
                totalQuestions: questions.length,
                timeTaken,
            });
        } catch (error) {
            console.error('Error finishing quiz:', error);
        }
    };

    if (questions.length === 0) {
        return (
            <View style={styles.container}>
                <Text>Loading questions...</Text>
            </View>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => handleAnswerSelect(option)}
                >
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
    },
    questionText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    optionButton: {
        backgroundColor: '#4caf50',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#388e3c',
    },
    optionText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
    },
});

export default StartQuizScreen;
