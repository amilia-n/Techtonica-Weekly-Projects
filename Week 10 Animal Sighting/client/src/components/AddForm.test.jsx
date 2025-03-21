// Unit tests for the AddForm component, testing form rendering and submission
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddForm from './AddForm';

describe('AddForm Component', () => {
  const mockOnDataUpdate = vi.fn();
  const mockSpeciesData = [];

  beforeEach(() => {
    render(
      <AddForm 
        activeTab="species" 
        speciesData={mockSpeciesData} 
        onDataUpdate={mockOnDataUpdate} 
      />
    );
  });

  it('renders species form when species tab is active', () => {
    expect(screen.getByText('Add New Species')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Common Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Scientific Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Population in Wild')).toBeInTheDocument();
    expect(screen.getByText('Select Conservation Status')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      })
    );

    const commonNameInput = screen.getByPlaceholderText('Common Name');
    const scientificNameInput = screen.getByPlaceholderText('Scientific Name');
    const populationInput = screen.getByPlaceholderText('Population in Wild');
    const statusSelect = screen.getByRole('combobox');
    
    fireEvent.change(commonNameInput, { target: { value: 'Test Species' } });
    fireEvent.change(scientificNameInput, { target: { value: 'Testus speciesus' } });
    fireEvent.change(populationInput, { target: { value: '100' } });
    fireEvent.change(statusSelect, { target: { value: 'Critically Endangered' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    await vi.waitFor(() => {
      expect(mockOnDataUpdate).toHaveBeenCalled();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/species',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commonName: 'Test Species',
          scientificName: 'Testus speciesus',
          wildPopulation: 100,
          conservationStatus: 'Critically Endangered'
        }),
      })
    );
  });
}); 