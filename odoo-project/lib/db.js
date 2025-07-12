import mongoose from 'mongoose'

const MONGO_URI = 'mongodb+srv://prakash8290682001:KDE145plycJO4fED@cluster0.xs7spfb.mongodb.net/skill-swap?retryWrites=true&w=majority&appName=Cluster0'

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  }
}

export default connectDB
