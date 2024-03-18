import { ChatController } from "./chat_controller";

function main() {
  let chatController = new ChatController(
    ".chat-container",
    ".chat-input",
    ".chat-button",
    ".subject",
    ".lateral-menu"
  );
  chatController.init();
}

main();