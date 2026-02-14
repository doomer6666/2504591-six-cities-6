type ParseCommand = Record<string, string[]>;

export class CommandParser {
  public static parse(cliArgs: string[]): ParseCommand {
    const commandMap: ParseCommand = {};
    let currentCommand: string | null = null;

    for (const arg of cliArgs) {
      if (arg.startsWith('--')) {
        currentCommand = arg;
        commandMap[currentCommand] = [];
      } else if (currentCommand) {
        commandMap[currentCommand].push(arg);
      }
    }

    return commandMap;
  }
}
