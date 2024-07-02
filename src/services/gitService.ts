import simpleGit, { SimpleGit } from 'simple-git';

const git: SimpleGit = simpleGit();

export async function getDiff(): Promise<string | undefined> {
  try {
    const diff = await git.diff();
    return diff;
  } catch (error) {
    console.error('Error getting diff:', error);
    return undefined;
  }
}

export async function getFileDiff(filePath: string): Promise<string | undefined> {
  try {
    const diff = await git.diff([filePath]);
    return diff;
  } catch (error) {
    console.error('Error getting file diff:', error);
    return undefined;
  }
}

export function adjustTagPositions(diff: string | undefined): void {
  if (!diff) {
    return;
  }

  // Parse the diff and adjust tag positions in the database
  // This is a simplified example and would need to be more robust in a real application
  const lines = diff.split('\n');
  lines.forEach(line => {
    if (line.startsWith('@@')) {
      // Extract line number changes and adjust tags
      const match = /@@ -(\d+),(\d+) \+(\d+),(\d+) @@/.exec(line);
      if (match) {
        // const oldStart = parseInt(match[1], 10);
        // const oldLength = parseInt(match[2], 10);
        // const newStart = parseInt(match[3], 10);
        // const newLength = parseInt(match[4], 10);

        // Logic to adjust tag positions based on these values
        // Example: updateTagPositions(oldStart, newStart, oldLength, newLength);
      }
    }
  });
}
