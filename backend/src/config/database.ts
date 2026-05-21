import mongoose from 'mongoose';

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
});

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Create geo-spatial indexes
    await createGeoIndexes();
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Server will continue without database. Please check:');
    console.log('   1. MongoDB Atlas IP whitelist includes your current IP');
    console.log('   2. Database credentials are correct');
    console.log('   3. Network connection is stable');
    console.log('');
    console.log('💡 Tip: For development, allow access from anywhere (0.0.0.0/0) in MongoDB Atlas');
    console.log('');
    
    // Don't exit - let server start and retry connection
    setTimeout(() => {
      console.log('🔄 Retrying MongoDB connection...');
      connectDatabase();
    }, 10000); // Retry after 10 seconds
  }
};

const createGeoIndexes = async (): Promise<void> => {
  try {
    const db = mongoose.connection.db;
    
    if (!db) {
      console.log('⚠️  Database not ready for index creation');
      return;
    }
    
    // Create 2dsphere index for geo-spatial queries on geoLocation field
    await db.collection('listings').createIndex({ geoLocation: '2dsphere' });
    
    console.log('✅ Geo-spatial indexes created');
  } catch (error) {
    console.error('⚠️  Geo-spatial index creation failed (this is fine if not using geo-search)');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
