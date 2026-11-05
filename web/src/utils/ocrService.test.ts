import { describe, it, expect } from 'vitest';
import { transcribeManuscriptImage, OcrProgressUpdate } from './ocrService';

describe('OCR Transcription Service (FR-CHR-01)', () => {
  it('processes image blob and emits sequential progress milestones', async () => {
    const progressUpdates: OcrProgressUpdate[] = [];
    const dummyBlob = new Blob(['sample-image-bytes'], { type: 'image/jpeg' });

    const result = await transcribeManuscriptImage(dummyBlob, (update) => {
      progressUpdates.push(update);
    });

    expect(progressUpdates.length).toBeGreaterThanOrEqual(3);
    expect(progressUpdates[progressUpdates.length - 1].progressPercent).toBe(100);
    expect(progressUpdates[progressUpdates.length - 1].phase).toBe('completed');

    expect(result).toHaveProperty('titleCandidate');
    expect(result).toHaveProperty('rawOcrText');
    expect(result).toHaveProperty('formattedMarkdown');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(result.extractedKeywords.length).toBeGreaterThan(0);
  });

  it('generates contextual title from File name', async () => {
    const dummyFile = new File(['bytes'], 'equinox_herbal_ritual.jpg', { type: 'image/jpeg' });
    const result = await transcribeManuscriptImage(dummyFile);

    expect(result.titleCandidate).toContain('Equinox herbal ritual');
    expect(result.rawOcrText.length).toBeGreaterThan(20);
  });
});
