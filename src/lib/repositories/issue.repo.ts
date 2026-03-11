
import { ObjectId } from 'mongodb';
import { getDb } from '../db/mongo';

export type Priority = 'Low' | 'Medium' | 'High';

export interface Issue {
  _id?: ObjectId;
  projectId: string; // Stored as string to match project.repo, though ObjectId is better in DB
  listId: string;
  title: string;
  description?: string;
  priority: Priority;
  order: number;
  labels?: string[];
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = 'issues';

export const IssueRepo = {
  async findAllByProject(projectId: string, filter: any = {}) {
    const db = await getDb();
    const query = { projectId, ...filter };
    return db.collection<Issue>(COLLECTION)
      .find(query)
      .sort({ order: 1 }) // Default sort by order
      .toArray();
  },

  async findById(id: string) {
    const db = await getDb();
    if (!ObjectId.isValid(id)) return null;
    return db.collection<Issue>(COLLECTION).findOne({ _id: new ObjectId(id) });
  },

  async create(data: Omit<Issue, '_id' | 'createdAt' | 'updatedAt'>) {
    const db = await getDb();
    const doc: Issue = {
      ...data,
      priority: data.priority || 'Medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection<Issue>(COLLECTION).insertOne(doc as any);
    return { ...doc, _id: result.insertedId };
  },

  async update(id: string, updates: Partial<Omit<Issue, '_id' | 'createdAt'>>) {
    const db = await getDb();
    if (!ObjectId.isValid(id)) return null;
    
    const result = await db.collection<Issue>(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updates,
          updatedAt: new Date(),
        } 
      }
    );
    
    if (result.matchedCount === 0) return null;
    return this.findById(id);
  },

  async delete(id: string) {
    const db = await getDb();
    if (!ObjectId.isValid(id)) return false;
    const result = await db.collection<Issue>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },
};
