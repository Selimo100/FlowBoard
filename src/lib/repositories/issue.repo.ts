import { ObjectId } from 'mongodb';
import { getDb } from '../db/mongo';

export interface Issue {
  _id?: ObjectId;
  projectId: string; // Storing as string or ObjectId? Keeping simple string for reference, but indexing might prefer ObjectId. Let's use string for simplicity in JSON or ObjectId if we map it. Let's stick to string for projectId ref for now to avoid complexity, or better, ObjectId.
  // The Prompt asked for "clean monolith structure". Using ObjectId for references is cleaner in Mongo.
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = 'issues';

export const IssueRepo = {
  async findAll(limit = 50) {
    const db = await getDb();
    return db.collection<Issue>(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  },

  async findByProject(projectId: string) {
     const db = await getDb();
     return db.collection<Issue>(COLLECTION)
       .find({ projectId })
       .sort({ createdAt: -1 })
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection<Issue>(COLLECTION).insertOne(doc as any);
    return { ...doc, _id: result.insertedId };
  },

  async update(id: string, data: Partial<Issue>) {
    const db = await getDb();
    if (!ObjectId.isValid(id)) return null;
    
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    delete (updateData as any)._id;

    const result = await db.collection<Issue>(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result;
  },

  async delete(id: string) {
    const db = await getDb();
    if (!ObjectId.isValid(id)) return false;
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
};
