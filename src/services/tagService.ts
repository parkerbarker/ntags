import { db, addFile, addTag, addFileTag } from '../data/database';

export async function addTagToFile(filePath: string, tagName: string, startLine: number, endLine: number, tagType: string): Promise<void> {
  // Ensure the file exists in the Files table
  const fileIdResult = db.exec('SELECT file_id FROM Files WHERE file_path = ?', [filePath]);
  let fileId;
  if (fileIdResult.length === 0) {
    fileId = addFile(filePath);
  } else {
    fileId = fileIdResult[0].values[0][0] as number;
  }

  // Ensure the tag exists in the Tags table
  const tagIdResult = db.exec('SELECT tag_id FROM Tags WHERE tag_name = ?', [tagName]);
  let tagId;
  if (tagIdResult.length === 0) {
    tagId = addTag(tagName);
  } else {
    tagId = tagIdResult[0].values[0][0] as number;
  }

  // Add the file tag to the FileTags table
  addFileTag(fileId, tagId, startLine, endLine, tagType);
}
