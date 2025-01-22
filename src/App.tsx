import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

import CreateQuizScreen from './screens/CreateQuizScreen';
import EditQuizScreen from './screens/EditQuizScreen';
import ListQuizzesScreen from './screens/ListQuizzesScreen';
import StartQuizScreen from './screens/StartQuizScreen';
import ResultsScreen from './screens/ResultsScreen';
import ResultsHistoryScreen from './screens/ResultsHistoryScreen';

type Props = {};

const Stack = createNativeStackNavigator();

const openDatabase = async (): Promise<SQLiteDatabase> => {
	return SQLite.openDatabase({ name: 'quizApp.db', location: 'default' });
};

const initializeDatabase = async () => {
	try {
		const db = await openDatabase();
		db.transaction(tx => {
			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS quizzes (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          title TEXT NOT NULL
        );`
			);
			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          quiz_id INTEGER, 
          question TEXT NOT NULL, 
          correct_answer TEXT NOT NULL, 
          option1 TEXT NOT NULL, 
          option2 TEXT NOT NULL, 
          option3 TEXT NOT NULL, 
          option4 TEXT NOT NULL
        );`
			);
			tx.executeSql(
				`CREATE TABLE IF NOT EXISTS results (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          quiz_id INTEGER, 
          score INTEGER, 
          time_taken INTEGER, 
          created_at TEXT
        );`
			);
		});
	} catch (error) {
		console.error('Database initialization failed:', error);
	}
};

const App: React.FC<Props> = () => {
	useEffect(() => {
		initializeDatabase();
	}, []);

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="ListQuizzes">
				<Stack.Screen name="ListQuizzes" component={ListQuizzesScreen} />
				<Stack.Screen name="CreateQuiz" component={CreateQuizScreen} />
				<Stack.Screen name="EditQuiz" component={EditQuizScreen} />
				<Stack.Screen name="StartQuiz" component={StartQuizScreen} />
				<Stack.Screen name="Results" component={ResultsScreen} />
				<Stack.Screen name="HistoryResults" component={ResultsHistoryScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
