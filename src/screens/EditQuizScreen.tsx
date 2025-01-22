import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Text, Alert } from 'react-native';
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

const EditQuizScreen: React.FC<Props> = ({ route, navigation }) => {
    const { quizId } = route.params;
    const [title, setTitle] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        loadQuizData();
    }, []);

    const loadQuizData = async () => {
        try {
            const db = await openDatabase();
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM quizzes WHERE id = ?', [quizId], (tx, results) => {
                    if (results.rows.length > 0) {
                        setTitle(results.rows.item(0).title);
                    }
                });
                tx.executeSql('SELECT * FROM questions WHERE quiz_id = ?', [quizId], (tx, results) => {
                    const rows = results.rows;
                    const fetchedQuestions: Question[] = [];
                    for (let i = 0; i < rows.length; i++) {
                        const item = rows.item(i);
                        fetchedQuestions.push({
                            question: item.question,
                            correctAnswer: item.correct_answer,
                            options: [item.option1, item.option2, item.option3, item.option4],
                        });
                    }
                    setQuestions(fetchedQuestions);
                });
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to load quiz data.');
            console.error(error);
        }
    };

    const saveQuiz = async () => {
        try {
            const db = await openDatabase();
            db.transaction(tx => {
                tx.executeSql('UPDATE quizzes SET title = ? WHERE id = ?', [title, quizId]);
                tx.executeSql('DELETE FROM questions WHERE quiz_id = ?', [quizId], () => {
                    questions.forEach(q => {
                        tx.executeSql(
                            `INSERT INTO questions (quiz_id, question, correct_answer, option1, option2, option3, option4) VALUES (?, ?, ?, ?, ?, ?, ?)`
                            , [quizId, q.question, q.correctAnswer, ...q.options]
                        );
                    });
                });
                Alert.alert('Success', 'Quiz updated successfully!');
                navigation.goBack();
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to save quiz data.');
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerText}>Edit Quiz</Text>
            <TextInput
                placeholder="Quiz Title"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />
            {questions.map((q, index) => (
                <View key={index} style={styles.questionContainer}>
                    <Text style={styles.questionHeader}>Question {index + 1}</Text>
                    <TextInput
                        placeholder={`Enter Question ${index + 1}`}
                        style={styles.input}
                        value={q.question}
                        onChangeText={text => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].question = text;
                            setQuestions(updatedQuestions);
                        }}
                    />
                    {q.options.map((option, i) => (
                        <TextInput
                            key={i}
                            placeholder={`Option ${i + 1}`}
                            style={styles.input}
                            value={option}
                            onChangeText={text => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[index].options[i] = text;
                                setQuestions(updatedQuestions);
                            }}
                        />
                    ))}
                    <TextInput
                        placeholder="Correct Answer"
                        style={styles.input}
                        value={q.correctAnswer}
                        onChangeText={text => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].correctAnswer = text;
                            setQuestions(updatedQuestions);
                        }}
                    />
                </View>
            ))}
            <Button title="Save Changes" onPress={saveQuiz} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    questionContainer: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    questionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default EditQuizScreen;
