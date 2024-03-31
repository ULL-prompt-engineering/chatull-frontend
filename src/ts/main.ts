import { ChatController } from "./chat_controller";

function main() {
  let chatController = new ChatController(
    ".chat-container",
    ".input-chat",
    ".chat-input",
    ".chat-button",
    ".subject",
    ".lateral-menu",
    ".modal-search",
    ".modal-list"
  );
}

main();