import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Receiver from "./receiver";
import Sender from "./sender";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reciver" element={<Receiver />} />
        <Route path="/sender" element={<Sender />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
