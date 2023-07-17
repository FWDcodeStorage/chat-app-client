import "./App.css";
import JoinRoom from "./components/JoinRoom";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./components/Chat";

const socket = io.connect("https://chat-app-live-z2di.onrender.com");

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState();
  const [room, setRoom] = useState("--Choose Room--");

  return (
    <div className='app w-[100vw] h-[100vh] flex justify-center items-center bg-[#2b2b2b]'>
      {!isLogged ? (
        <JoinRoom
          socket={socket}
          isLogged={isLogged}
          setIsLogged={setIsLogged}
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
        />
      ) : (
        <Chat
          socket={socket}
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
        />
      )}
    </div>
  );
}

export default App;
