import chalk from 'chalk';
import { TsvFileReader } from '../../shared/libs/file-reader/index.js';
import { ICommand } from './command.interface.js';

export class ImportCommand implements ICommand {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filePath] = parameters;
    const fileReader = new TsvFileReader(filePath?.trim());
    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error) {
      console.error(chalk.redBright('Error reading file:', error));
    }
  }
}
