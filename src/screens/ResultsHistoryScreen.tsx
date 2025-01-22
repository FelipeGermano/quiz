import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

type Result = {
    id: number;
    quiz_id: number;
    score: number;
    time_taken: number;
    created_at: string;
};

const openDatabase = async (): Promise<SQLiteDatabase> => {
    return SQLite.openDatabase({ name: 'quizApp.db', location: 'default' });
};

const ResultsHistoryScreen: React.FC = () => {
    const [results, setResults] = useState<Result[]>([]);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const db = await openDatabase();
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM results', [], (tx, results) => {
                    const rows = results.rows;
                    const fetchedResults: Result[] = [];
                    for (let i = 0; i < rows.length; i++) {
                        fetchedResults.push(rows.item(i));
                    }
                    console.log(fetchedResults);
                    setResults(fetchedResults);
                });
            });
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    };

    const renderResult = ({ item }: { item: Result }) => (
        <View style={styles.resultItem}>
            <Text style={styles.resultText}>Quiz ID: {item.quiz_id}</Text>
            <Text style={styles.resultText}>Score: {item.score}</Text>
            <Text style={styles.resultText}>Time Taken: {item.time_taken} seconds</Text>
            <Text style={styles.resultText}>Date: {new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Results History</Text>
            <FlatList
                data={results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderResult}
                ListEmptyComponent={<Text style={styles.emptyText}>No results found.</Text>}
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    resultItem: {
        padding: 16,
        backgroundColor: '#ffffff',
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    resultText: {
        fontSize: 16,
        marginBottom: 4,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 32,
        color: '#888',
    },
});

export default ResultsHistoryScreen;
