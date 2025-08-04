import * as SQLite from 'expo-sqlite'
import { SQLiteDatabase } from 'expo-sqlite'

export class Database {
  private databaseName: string
  private database: SQLiteDatabase
  private static instances: Record<string, Database> = {}

  private constructor(databaseName: string) {
    this.databaseName = databaseName
  }

  private async openDatabase() {
    if (!this.database) {
      this.database = await SQLite.openDatabaseAsync(this.databaseName)
    }
  }

  static instance(databaseName: string): Database {
    if (!this.instances[databaseName]) {
      this.instances[databaseName] = new Database(databaseName)
    }

    return this.instances[databaseName]
  }

  async sqlDatabase() {
    await this.openDatabase()
    return this.database
  }

  async close(): Promise<void> {
    if (!this.database) return
    await this.database.closeAsync()
    this.database = undefined
  }

  async reset(): Promise<void> {
    this.openDatabase()
    await this.database.closeAsync()
    await SQLite.deleteDatabaseAsync(this.databaseName)
    this.database = undefined
  }
}
