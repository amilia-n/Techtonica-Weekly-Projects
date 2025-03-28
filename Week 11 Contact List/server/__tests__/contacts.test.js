const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

describe('Contacts API', () => {
  let testContactId;

  // Test data
  const testContact = {
    contact_name: 'Test Contact',
    phone: '123-456-7890',
    email: 'test@example.com',
    note: 'Test note',
    tags: ['Test']
  };

  // Clean up after all tests
  afterAll(async () => {
    if (testContactId) {
      try {
        await axios.delete(`${BASE_URL}/contacts/${testContactId}`);
      } catch (error) {
        console.error('Cleanup failed:', error.message);
      }
    }
  });

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

  test('POST /contacts should create a new contact', async () => {
    const response = await axios.post(`${BASE_URL}/contacts`, testContact);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('contact_id');
    expect(response.data.contact_name).toBe(testContact.contact_name);
    expect(response.data.phone).toBe(testContact.phone);
    expect(response.data.email).toBe(testContact.email);
    expect(response.data.note).toBe(testContact.note);
    expect(response.data.tags).toBe(testContact.tags.join(', '));
    
    // Store the contact ID for later tests
    testContactId = response.data.contact_id;
  });

  test('POST /contacts should validate required fields', async () => {
    const invalidContact = {
      contact_name: '',
      phone: '',
      email: 'test@example.com'
    };

    await expect(axios.post(`${BASE_URL}/contacts`, invalidContact))
      .rejects
      .toMatchObject({
        response: {
          status: 400,
          data: {
            error: expect.stringContaining('required')
          }
        }
      });
  });

  test('PUT /contacts/:id should update an existing contact', async () => {
    const updatedContact = {
      ...testContact,
      contact_name: 'Updated Test Contact',
      phone: '098-765-4321'
    };

    const response = await axios.put(`${BASE_URL}/contacts/${testContactId}`, updatedContact);
    
    expect(response.status).toBe(200);
    expect(response.data.contact_name).toBe(updatedContact.contact_name);
    expect(response.data.phone).toBe(updatedContact.phone);
    expect(response.data.email).toBe(updatedContact.email);
    expect(response.data.note).toBe(updatedContact.note);
    expect(response.data.tags).toBe(updatedContact.tags.join(', '));
  });

  test('PUT /contacts/:id should validate required fields', async () => {
    const invalidUpdate = {
      contact_name: '',
      phone: ''
    };

    await expect(axios.put(`${BASE_URL}/contacts/${testContactId}`, invalidUpdate))
      .rejects
      .toMatchObject({
        response: {
          status: 400,
          data: {
            error: expect.stringContaining('required')
          }
        }
      });
  });

  test('DELETE /contacts/:id should delete a contact', async () => {
    const response = await axios.delete(`${BASE_URL}/contacts/${testContactId}`);
    
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Contact deleted successfully');

    // Verify the contact is deleted
    try {
      await axios.get(`${BASE_URL}/contacts/${testContactId}`);
      fail('Contact should not exist');
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  test('DELETE /contacts/:id should handle non-existent contact', async () => {
    try {
      await axios.delete(`${BASE_URL}/contacts/999999`);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.error).toContain('not found');
    }
  });
}); 