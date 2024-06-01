import { useEffect } from "react";

const Receiver = () => {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "receiver" }));
    };

    socket.onmessage = async (event: MessageEvent) => {
      console.log(event.data);
      const message = JSON.parse(event.data);
      if (message.type === "create-offer") {
        console.log("offer creatd");
        const pc = new RTCPeerConnection();
        await pc.setRemoteDescription(message.offer);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.send(
          JSON.stringify({ type: "create-answer", offer: pc.localDescription }),
        );
      }
    };
  }, []);
  return <div>Reciver</div>;
};

export default Receiver;
