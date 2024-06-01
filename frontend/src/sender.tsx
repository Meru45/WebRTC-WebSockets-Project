import { useEffect, useState } from "react";

const Sender = () => {
  const [socket, setSocket] = useState<null | WebSocket>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
    };

    socket.onmessage = (message) => {
      console.log("Message received", message.data);
    };

    setSocket(socket);
  }, []);

  const startSendingVideo = async () => {
    if (!socket) return;
    const pc = new RTCPeerConnection();

    const offer = await pc.createOffer();

    pc.setLocalDescription(offer);

    socket?.send(
      JSON.stringify({ type: "create-offer", offer: pc.localDescription }),
    );

    socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.type === "create-answer") {
        pc.setRemoteDescription(message.offer);
      }
    };
  };

  return (
    <div>
      <button onClick={startSendingVideo}>Send Video</button>
    </div>
  );
};

export default Sender;
