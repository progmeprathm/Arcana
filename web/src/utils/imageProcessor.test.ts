import { describe, it, expect } from 'vitest';
import { loadImageFromFile } from './imageProcessor';

describe('Image Preprocessor Validation', () => {
  it('rejects non-image files with clear technical error', async () => {
    const invalidFile = new File(['text content'], 'notes.txt', { type: 'text/plain' });
    await expect(loadImageFromFile(invalidFile)).rejects.toThrow(
      'Invalid file type: text/plain. Expected an image.'
    );
  });
});
