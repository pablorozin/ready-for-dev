import request from 'supertest';
import express from 'express';
import morgan from 'morgan';
import { Writable } from 'stream';
import app from '../index';
import { healthRouter } from '../routes/health';

describe('Request Logging Middleware', () => {
  test('should not interfere with normal request processing', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('should handle multiple requests without issues', async () => {
    const requests = [
      request(app).get('/health'),
      request(app).get('/health'),
      request(app).get('/health')
    ];

    const responses = await Promise.all(requests);

    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  test('should handle non-existent routes', async () => {
    const response = await request(app).get('/non-existent');

    expect(response.status).toBe(404);
  });

  test('should output log in correct format when Morgan is enabled', async () => {
    // Arrange: Create a separate Express app with Morgan explicitly enabled
    const testApp = express();
    const logOutputs: string[] = [];

    // Create a writable stream to capture Morgan output
    const logStream = new Writable({
      write(chunk, _encoding, callback) {
        logOutputs.push(chunk.toString());
        callback();
      }
    });

    // Set up the test app with Morgan enabled (bypassing NODE_ENV guard)
    testApp.use(morgan(':method :url :status :response-time ms', { stream: logStream }));
    testApp.use(express.json());
    testApp.use('/health', healthRouter);

    // Act: Make a request to generate log output
    const response = await request(testApp).get('/health');

    // Assert: Verify response is successful
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });

    // Assert: Verify log output was captured and matches expected format
    expect(logOutputs).toHaveLength(1);
    const logLine = logOutputs[0].trim();

    // Verify format matches: METHOD /path STATUS time_ms
    expect(logLine).toMatch(/^GET \/health 200 \d+(\.\d+)? ms$/);
  });
});