import mongoose from 'mongoose';

const dbConnection = async () => {
    try {
        mongoose.set('strictQuery', false);
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
            socketTimeoutMS: 45000,
            family: 4
        };
        await mongoose.connect(process.env.MONGODB_CNN, dbOptions);
        console.log("MongoDB database connection established successfully!");
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw new Error("Database initialization error: " + error.message);
    }

    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB disconnected on app termination');
        process.exit(0);
    });
};

export default dbConnection;
