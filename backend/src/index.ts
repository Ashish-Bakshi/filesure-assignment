import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import connectDB from './lib/db';
import authRoutes from './routes/auth.route';
import purchaseRoutes from './routes/purchase.route';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/purchase', purchaseRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // shut down server if DB connection fails
  }
};

startServer();
