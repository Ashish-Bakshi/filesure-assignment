import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});