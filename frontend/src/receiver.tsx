import { useEffect } from "react";

const Receiver = () => {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "receiver" }));
    };

    socket.onmessage = async (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.type === "create-offer") {
        const pc = new RTCPeerConnection();
        pc.setRemoteDescription(message.offer);

        const answer = await pc.createAnswer();
        pc.setLocalDescription(answer);

        socket.send(
          JSON.stringify({ type: "create-ans", offer: pc.localDescription }),
        );
      }
    };

    setSocket(socket);
  }, []);
  return <div>Reciver</div>;
};

export default Receiver;
