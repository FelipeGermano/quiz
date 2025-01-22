import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ScrollView, Text } from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

type Question = {
    question: string;
    correctAnswer: string;
    options: string[];
};

type Props = {
    navigation: any;
};

const openDatabase = async (): Promise<SQLiteDatabase> => {
    return SQLite.openDatabase({ name: 'quizApp.db', location: 'default' });
};

const CreateQuizScreen: React.FC<Props> = ({ navigation }) => {
    const [title, setTitle] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);

    const addQuestion = () => {
        setQuestions([...questions, { question: '', correctAnswer: '', options: ['', '', '', ''] }]);
    };

    const saveQuiz = async () => {
        if (!title || questions.length === 0) {
            Alert.alert('Validation Error', 'Please enter a title and add at least one question.');
            return;
        }

        try {
            const db = await openDatabase();
            db.transaction(tx => {
                tx.executeSql('INSERT INTO quizzes (title) VALUES (?)', [title], (tx, results) => {
                    const quizId = results.insertId;
                    questions.forEach(q => {
                        tx.executeSql(
                            `INSERT INTO questions (quiz_id, question, correct_answer, option1, option2, option3, option4) VALUES (?, ?, ?, ?, ?, ?, ?)`
                            , [quizId, q.question, q.correctAnswer, ...q.options]
                        );
                    });
                    Alert.alert('Success', 'Quiz saved successfully!');
                    navigation.goBack();
                });
            });
        } catch (error) {
            console.error('Error saving quiz:', error);
            Alert.alert('Error', 'An error occurred while saving the quiz. Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerText}>Create New Quiz</Text>
            <TextInput
                placeholder="Quiz Title"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />
            <Button title="Add Question" onPress={addQuestion} />
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
            <Button title="Save Quiz" onPress={saveQuiz} />
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

export default CreateQuizScreen;
