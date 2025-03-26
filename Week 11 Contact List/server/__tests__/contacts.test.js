const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

describe('Contacts API', () => {
  test('GET /contacts should return all contacts with their tags', async () => {
    const response = await axios.get(`${BASE_URL}/contacts`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    
    // Check the structure of the first contact
    const firstContact = response.data[0];
    expect(firstContact).toHaveProperty('contact_id');
    expect(firstContact).toHaveProperty('contact_name');
    expect(firstContact).toHaveProperty('phone');
    expect(firstContact).toHaveProperty('email');
    expect(firstContact).toHaveProperty('note');
    expect(firstContact).toHaveProperty('tags');
  });

  test('GET /contacts should filter contacts by search query', async () => {
    const searchQuery = 'Erin';
    const response = await axios.get(`${BASE_URL}/contacts?search=${searchQuery}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    
    // Check if the returned contacts match the search query
    response.data.forEach(contact => {
      expect(contact.contact_name.toLowerCase()).toContain(searchQuery.toLowerCase());
    });
  });

  test('GET /contacts should return empty array when no matches found', async () => {
    const response = await axios.get(`${BASE_URL}/contacts?search=nonexistentcontact`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBe(0);
  });

  test('GET /contacts should handle special characters in search query', async () => {
    const response = await axios.get(`${BASE_URL}/contacts?search=%`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
}); 