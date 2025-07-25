import { CLIInterface } from "./cli/CLIInterface";

async function main() {
  const cli = new CLIInterface();
  await cli.run();
}

main();
