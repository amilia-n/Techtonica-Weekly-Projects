const request = require('supertest');
const express = require('express');
const { Pool } = require('pg');
const http = require('http');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../db/connect');

process.env.GEMINI_API_KEY = 'test-api-key';
process.env.PORT = '3000';
process.env.NODE_ENV = 'test';

const app = require('../server');
let server;

jest.mock('@google/generative-ai');
jest.mock('../db/connect');

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      startChat: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({
          response: {
            text: () => Promise.resolve(JSON.stringify({
              matchInfo: {
                date: "3/26/25, 10:05 PM",
                map: "Icebox",
                result: "Victory",
                duration: "21m 11s"
              },
              teamA: [],
              teamB: []
            }))
          }
        })
      })
    })
  }))
}));

describe('Express App', () => {
  let server;

  beforeAll(() => {
    if (!server && process.env.NODE_ENV !== 'test') {
      server = app.listen(0);
    }
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /process-match-data', () => {
    it('should return 400 if pastedData is missing', async () => {
      const response = await request(app)
        .post('/process-match-data')
        .send({ agentName: 'Reyna' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Pasted data is required');
    });

    it('should return 500 if Gemini API key is missing', async () => {
      const originalApiKey = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = '';
      
      const response = await request(app)
        .post('/process-match-data')
        .send({ pastedData: 'sample match data', agentName: 'Reyna' });
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Server configuration error');
      expect(response.body.details).toBe('Invalid or missing Gemini API key');
      
      process.env.GEMINI_API_KEY = originalApiKey;
    });

    it('should process match data successfully', async () => {
      const mockResponse = {
        response: {
          text: jest.fn().mockResolvedValue(JSON.stringify({
            matchInfo: {
              date: "3/26/25, 10:05 PM",
              duration: "21m 11s",
              map: "Icebox",
              result: "Victory"
            },
            teamA: [],
            teamB: []
          }))
        }
      };
      
      const mockChatSession = {
        sendMessage: jest.fn().mockResolvedValue(mockResponse)
      };
      
      GoogleGenerativeAI.prototype.getGenerativeModel.mockReturnValue({
        startChat: jest.fn().mockReturnValue(mockChatSession)
      });
      
      const response = await request(app)
        .post('/process-match-data')
        .send({ pastedData: 'sample match data', agentName: 'Reyna' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('matchInfo');
      expect(response.body).toHaveProperty('teamA');
      expect(response.body).toHaveProperty('teamB');
    });
  });

  describe('POST /save-match', () => {
    it('should save match data to the database', async () => {
      const mockMatchData = {
        map: 'Icebox',
        result: 'Victory',
        duration: '21m 11s',
        match_date: '2023-04-01',
        all_players_data: { teamA: [], teamB: [] }
      };
      
      pool.query.mockResolvedValueOnce({ rows: [mockMatchData] });
      
      const response = await request(app)
        .post('/save-match')
        .send(mockMatchData);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMatchData);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO matches'),
        expect.arrayContaining([
          'Icebox', 'Victory', '21m 11s', '2023-04-01', { teamA: [], teamB: [] }
        ])
      );
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));
      
      const response = await request(app)
        .post('/save-match')
        .send({
          map: 'Icebox',
          result: 'Victory',
          duration: '21m 11s',
          match_date: '2023-04-01',
          all_players_data: {}
        });
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /matches', () => {
    it('should retrieve matches from the database', async () => {
      const mockMatches = [
        { id: 1, map: 'Icebox', result: 'Victory' },
        { id: 2, map: 'Bind', result: 'Defeat' }
      ];
      
      pool.query.mockResolvedValueOnce({ rows: mockMatches });
      
      const response = await request(app).get('/matches');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMatches);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM matches ORDER BY match_date DESC'
      );
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));
      
      const response = await request(app).get('/matches');
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('POST /analyze-match', () => {
    it('should analyze match data and return insights', async () => {
      const mockMatchData = {
        matchInfo: { matchId: 1 },
        all_players_data: {
          teamA: [],
          teamB: [{ is_user: true, agent: 'Reyna' }]
        }
      };
      
      const mockResponse = {
        response: {
          text: jest.fn().mockResolvedValue('Analysis result')
        }
      };
      
      const mockChatSession = {
        sendMessage: jest.fn().mockResolvedValue(mockResponse)
      };
      
      GoogleGenerativeAI.prototype.getGenerativeModel.mockReturnValue({
        startChat: jest.fn().mockReturnValue(mockChatSession)
      });
      
      pool.query.mockResolvedValueOnce({ rows: [] });
      
      const response = await request(app)
        .post('/analyze-match')
        .send(mockMatchData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('analysis', 'Analysis result');
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO match_analysis'),
        [1, 'Analysis result']
      );
    });
  });

  describe('POST /save-match-analysis', () => {
    it('should save match analysis to the database', async () => {
      const mockAnalysis = {
        match_id: 1,
        content: 'Test analysis'
      };
      
      pool.query.mockResolvedValueOnce({ rows: [mockAnalysis] });
      
      const response = await request(app)
        .post('/save-match-analysis')
        .send(mockAnalysis);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAnalysis);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO match_analysis'),
        [1, 'Test analysis']
      );
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));
      
      const response = await request(app)
        .post('/save-match-analysis')
        .send({
          match_id: 1,
          content: 'Test analysis'
        });
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('CORS Configuration', () => {
    it('should allow requests from allowed origins', async () => {
      const response = await request(app)
        .get('/matches')
        .set('Origin', 'http://localhost:5173');
      
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('should not allow requests from disallowed origins', async () => {
      const response = await request(app)
        .get('/matches')
        .set('Origin', 'http://disallowed.com');
      
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });
}); 