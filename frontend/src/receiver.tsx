import { useEffect, useState } from "react";

const Receiver = () => {
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

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
        setPc(pc);
        await pc.setRemoteDescription(message.offer);

        pc.onicecandidate = (event) => {
          console.log(event);
          if (event.candidate) {
            socket?.send(
              JSON.stringify({
                type: "iceCandidate",
                candidate: event.candidate,
              }),
            );
          }
        };

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.send(
          JSON.stringify({ type: "create-answer", offer: pc.localDescription }),
        );
      } else if (message.type === "iceCandidate") {
        if (!pc) {
          return;
        }
        pc.addIceCandidate(message.candidate);
      }
    };
  }, []);
  return <div>Reciver</div>;
};

export default Receiver;
