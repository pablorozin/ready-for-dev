import express from 'express';
import morgan from 'morgan';
import { healthRouter } from './routes/health';

const app = express();
const PORT = 3000;

// Add request logging middleware (skip during tests)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(':method :url :status :response-time ms'));
}

app.use(express.json());
app.use('/health', healthRouter);

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
