import { SessionController } from "./session_controller";

function main() {
  let sessionController = new SessionController(".api-key", ".send-api-key");

  sessionController.Init();
}

main();
