/**
 * Formats a note by adding a timestamp and user information.
 *
 * @param {string} content - The content of the note.
 * @param {string} [user] - The user who created the note. Defaults to 'Anonymous' if not provided.
 * @returns {string} The formatted note with timestamp and user information.
 * @example
 * // returns:
 * // "2024-05-12 10:30:45 - John: This is a sample note."
 * formatNote("This is a sample note.", "John");
 */
function formatNote(content, user = 'Anonymous') {
  const timestamp = new Date()
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z/, '');
  return `${timestamp} - ${user}: ${content}`;
}

module.exports = {formatNote};
