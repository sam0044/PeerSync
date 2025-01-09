const CHUNK_SIZE = 16384; // 16KB chunks

export function* getFileChunks(file: File) {
  let offset = 0;
  while (offset < file.size) {
    const chunk = file.slice(offset, offset + CHUNK_SIZE);
    offset += chunk.size;
    const isLastChunk = offset >= file.size;
    yield {
      chunk,
      isLastChunk,
      metadata: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
    };
  }
}

export async function reconstructFile(chunks: Blob[], metadata: {
  fileName: string;
  fileType: string;
  fileSize: number;
}) {
  const file = new File(chunks, metadata.fileName, {
    type: metadata.fileType,
  });
  return file;
}