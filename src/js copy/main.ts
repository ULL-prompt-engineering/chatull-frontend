import { ChatController } from "./chat_controller";

function main() {
  let chatController = new ChatController(
    ".chat-container",
    ".chat-input",
    ".chat-button",
    ".subject-selector",
    ".lateral-menu"
  );
  chatController.init();
}

main();