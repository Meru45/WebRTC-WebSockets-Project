import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

//TODO: Create user manager class (backend state management) instead of global variables
let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on("connection", (ws) => {
  ws.on("error", console.error);
  ws.send("Connected");

  ws.on("message", (data: any) => {
    //TODO: Instead of so many if and else if create switch-case
    const message = JSON.parse(data);

    if (message.type === "sender") {
      senderSocket = ws;
    } else if (message.type === "receiver") {
      receiverSocket = ws;
    } else if (message.type === "create-offer") {
      if (ws != senderSocket) {
        return;
      }

      receiverSocket?.send(
        JSON.stringify({ type: "create-offer", offer: message.offer }),
      );
    } else if (message.type === "create-answer") {
      if (ws != receiverSocket) {
        return;
      }

      senderSocket?.send(
        JSON.stringify({ type: "create-answer", offer: message.offer }),
      );
    } else if (message.type === "iceCandidate") {
      if (ws === senderSocket) {
        receiverSocket?.send(
          JSON.stringify({
            type: "iceCandidate",
            candidate: message.candidate,
          }),
        );
      } else if (ws === receiverSocket) {
        senderSocket?.send(
          JSON.stringify({
            type: "iceCandidate",
            candidate: message.candidate,
          }),
        );
      }
    }
  });
});
