import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

type Quiz = {
    id: number;
    title: string;
};

type Props = {
    navigation: any;
};

const openDatabase = async (): Promise<SQLiteDatabase> => {
    return SQLite.openDatabase({ name: 'quizApp.db', location: 'default' });
};

const ListQuizzesScreen: React.FC<Props> = ({ navigation }) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const db = await openDatabase();
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM quizzes', [], (tx, results) => {
                    const rows = results.rows;
                    const quizzesList: Quiz[] = [];
                    for (let i = 0; i < rows.length; i++) {
                        quizzesList.push(rows.item(i));
                    }
                    setQuizzes(quizzesList);
                });
            });
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    const deleteQuiz = async (id: number) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this quiz?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const db = await openDatabase();
                        db.transaction(tx => {
                            tx.executeSql('DELETE FROM quizzes WHERE id = ?', [id], () => fetchQuizzes());
                            tx.executeSql('DELETE FROM questions WHERE quiz_id = ?', [id]);
                        });
                    } catch (error) {
                        console.error('Error deleting quiz:', error);
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.containerButtons}>
                <Button color={"green"} title="Ver Resultados" onPress={() => navigation.navigate('HistoryResults')} />
            </View>
            <View style={styles.containerButtons}>
                <Button title="Create New Quiz" onPress={() => navigation.navigate('CreateQuiz')} />
            </View>
            <FlatList
                data={quizzes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.quizItem}>
                        <Text style={styles.quizTitle}>{item.title}</Text>
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.startButton]}
                                onPress={() => navigation.navigate('StartQuiz', { quizId: item.id })}
                            >
                                <Text style={styles.buttonText}>Start</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.editButton]}
                                onPress={() => navigation.navigate('EditQuiz', { quizId: item.id })}
                            >
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={() => deleteQuiz(item.id)}
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    containerButtons: {
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    
    quizItem: {
        padding: 16,
        backgroundColor: '#ffffff',
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    quizTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        padding: 8,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    startButton: {
        backgroundColor: '#4caf50',
    },
    editButton: {
        backgroundColor: '#2196f3',
    },
    deleteButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default ListQuizzesScreen;
