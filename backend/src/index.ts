import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from './lib/db';
import authRoutes from './routes/auth.route';
import purchaseRoutes from './routes/purchase.route';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
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
