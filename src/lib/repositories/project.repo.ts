// Explanation: This repository is responsible for direct database interactions for Projects.
// It uses the MongoDB driver to find, insert, update, and delete project documents in the 'projects' collection.

import { ObjectId } from 'mongodb';
import { getDb } from '../db/mongo';

export interface Project {
  _id?: ObjectId;
  name: string;
  description?: string;
  repositoryUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = 'projects';

export const ProjectRepo = {
  async findAll(limit = 50) {
    const db = await getDb();
    return db.collection<Project>(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  },

  async findById(id: string) {
    const db = await getDb();
    if (!ObjectId.isValid(id)) return null;
    return db.collection<Project>(COLLECTION).findOne({ _id: new ObjectId(id) });
  },

  async create(data: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) {
    const db = await getDb();
    const doc: Project = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection<Project>(COLLECTION).insertOne(doc as any);
    return { ...doc, _id: result.insertedId };
  },

  async update(id: string, data: Partial<Project>) {
    const db = await getDb();
    if (!ObjectId.isValid(id)) return null;
    
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    delete (updateData as any)._id; // prevent updating _id

    const result = await db.collection<Project>(COLLECTION).findOneAndUpdate(
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
