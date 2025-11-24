import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixInviteCodeIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('communitycircles');

    // Drop the existing inviteCode index if it exists
    try {
      await collection.dropIndex('inviteCode_1');
      console.log('Dropped existing inviteCode_1 index');
    } catch (error) {
      console.log('No existing inviteCode_1 index to drop');
    }

    // Create a new sparse unique index
    await collection.createIndex(
      { inviteCode: 1 },
      { unique: true, sparse: true }
    );
    console.log('Created new sparse unique index on inviteCode');

    console.log('Index fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing index:', error);
    process.exit(1);
  }
};

fixInviteCodeIndex();
