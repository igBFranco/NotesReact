import SQLite from 'react-native-sqlite-storage';

const database_name = 'notes.db';
const database_version = '1.0';
const database_displayname = 'Notes Database';

export const openDatabase = () => {
  return SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
  );
  
};

export const createTable = () => {
    const db = openDatabase();
    db.transaction((txn) => {
      txn.executeSql(
        `
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT,
            text TEXT,
            date TEXT,
            image TEXT,
            latitude REAL,
            longitude REAL
        );
      `,
        [],
        (tx, result) => {
          console.log("Table creation result:", result);
        },
        (error) => {
          console.log("Table creation error:", error);
        }
      );
    });
  };
  