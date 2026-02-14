#!/usr/bin/env node
import {
  CLIApplication,
  HelpCommand,
  VersionCommand,
  ImportCommand,
} from './cli/index.js';

function bootstrap() {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommand([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
  ]);
  cliApplication.processCommands(process.argv);
}

bootstrap();
