import mongoose from 'mongoose';


const connection = mongoose.createConnection(process.env.MONGODB_URI);

export default connection;
