import {formatNote} from '../scripts/parseNote';

describe('formatNote function', () => {
  it('should format a note with timestamp and user', () => {
    const result = formatNote('This is a sample note.', 'John');
    expect(result).toMatch(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} - John: This is a sample note\.$/,
    );
  });

  it('should format a note with default user', () => {
    const result = formatNote('This is a sample note.');
    expect(result).toMatch(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} - Anonymous: This is a sample note\.$/,
    );
  });
});
