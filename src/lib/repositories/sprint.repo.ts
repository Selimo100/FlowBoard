import { ObjectId } from 'mongodb';
import { getDb } from '../db/mongo';

export interface Sprint {
  _id?: ObjectId;
  projectId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'future' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = 'sprints';

export const SprintRepo = {
  async findAll(limit = 50) {
    const db = await getDb();
    return db.collection<Sprint>(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  },

  async findById(id: string) {
    const db = await getDb();
    if (!ObjectId.isValid(id)) return null;
    return db.collection<Sprint>(COLLECTION).findOne({ _id: new ObjectId(id) });
  },

  async create(data: Omit<Sprint, '_id' | 'createdAt' | 'updatedAt'>) {
    const db = await getDb();
    const doc: Sprint = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection<Sprint>(COLLECTION).insertOne(doc as any);
    return { ...doc, _id: result.insertedId };
  },

  async update(id: string, data: Partial<Sprint>) {
    const db = await getDb();
    if (!ObjectId.isValid(id)) return null;
    
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    delete (updateData as any)._id;

    const result = await db.collection<Sprint>(COLLECTION).findOneAndUpdate(
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
