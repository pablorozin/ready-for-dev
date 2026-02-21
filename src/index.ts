import express from 'express';
import { healthRouter } from './routes/health';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/health', healthRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
