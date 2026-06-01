import { createReadStream } from 'node:fs';
import { EventEmitter } from 'node:events';
import { IFileReader } from './file-reader.interface.js';

const CHUNK_SIZE = 16384;

export class TsvFileReader extends EventEmitter implements IFileReader {
  constructor(private filePath: string) {
    super();
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filePath, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const line = remainingData.slice(0, nextLinePosition + 1).trim();
        remainingData = remainingData.slice(nextLinePosition + 1);

        if (line.length === 0) {
          continue;
        }

        importedRowCount++;

        await new Promise((resolve) => {
          this.emit('line', line, resolve);
        });
      }
    }

    this.emit('end', importedRowCount);
  }
}
