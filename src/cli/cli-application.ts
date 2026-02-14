import chalk from 'chalk';
import { CommandParser } from './command-parser.js';
import { ICommand } from './commands/command.interface.js';

type CommandCollection = Record<string, ICommand>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(private readonly defaultCommands: string = '--help') {}

  public registerCommand(commandList: ICommand[]): void {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        console.warn(
          chalk.yellowBright(
            `Command ${command.getName()} is already registered. Skipping.`
          )
        );
        return;
      }
      this.commands[command.getName()] = command;
    });
  }

  public getCommand(name: string): ICommand | null {
    if (Object.hasOwn(this.commands, name)) {
      return this.commands[name];
    }
    console.warn(chalk.yellowBright(`Command ${name} not found.`));
    return null;
  }

  public getDefaultCommand(): ICommand | null {
    return this.getCommand(this.defaultCommands);
  }

  public processCommands(commands: string[]): void {
    const parsedCommands = CommandParser.parse(commands);
    const [commandName] = Object.keys(parsedCommands);

    if (commandName) {
      const command = this.getCommand(commandName);
      const commandArgs = parsedCommands[commandName] ?? [];
      command?.execute(...commandArgs);
    } else {
      this.getDefaultCommand()?.execute();
    }
  }
}
