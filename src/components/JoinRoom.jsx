import { useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import Images from "../Images";

const JoinRoom = ({
  socket,
  isLogged,
  setIsLogged,
  username,
  setUsername,
  room,
  setRoom,
}) => {
  const options = ["Frontend", "Backend", "Design"];
  const [open, setOpen] = useState(false);

  //join the room - onClick event
  const joinRoom = () => {
    //the username && room condition ensures that both username and room are truthy values
    //This ensures that empty spaces are not considered valid values
    if (username && room && username.trim() !== "" && room.trim() !== "") {
      localStorage.setItem("username", username);
      socket.emit("join_room", { username, room });
      setIsLogged(true);
    } else alert("Please fill out this form!");
  };

  return (
    <div className='app w-full flex justify-center items-center mx-auto'>
      <div className='select_div lg:w-[50vw] lg:h-[80vh] w-[300px] h-[480px] md:w-[60vw] md:h-[70vh] px-[2em] bg-[#2b2b2b] md:px-[5em] py-[4em] border-2 border-[#67ff4f] shadow-md shadow-[#67ff4f6f] rounded-lg cursor-pointer flex flex-col justify-center gap-[1em]'>
        <div className='logo w-full flex justify-center items-center mb-[2em]'>
          <img src={Images.logo} alt='logo' />
        </div>
        <input
          type='text'
          placeholder='Username...'
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className='w-full bg-[#2b2b2b] p-[.5em]  border-2 border-[#67ff4f] sm:text-md text-sm tracking-wide font-light text-gray-300 outline-none rounded-md mb-[.5em] focus:shadow-[#67ff4f6f]'
        />
        <div
          onClick={() => setOpen(!open)}
          className='select mb-[.5em] w-full p-[.5em] border-2 border-[#67ff4f] shadow-md shadow-[#67ff4f6f] text-gray-400 text-center sm:text-md text-sm tracking-wide rounded-md flex justify-between items-center'
        >
          {room}
          <BiSolidDownArrow />
        </div>
        <ul
          className={`w-full  border-2 border-[#67ff4f] shadow-md rounded-md text-gray-500 text-center ${
            open ? "block" : "hidden"
          }`}
        >
          {options.map((option) => (
            <li
              key={option}
              className='bg-[#4f4f4f] p-[.5em] border-b text-gray-400 hover:bg-[#67ff4f6f] hover:text-white'
              onClick={(e) => {
                setRoom(e.target.innerText);
                setOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
        <button
          onClick={joinRoom}
          className='w-full text-center text-gray-400 font-extrabold tracking-wider sm:text-lg text-md border-2 border-[#67ff4f] bg-[rgb(103,255,79)] shadow-[#67ff4f6f] p-[.5em] rounded-md hover:bg-transparent hover:text-[#67ff4f] transition-colors ease-in duration-300'
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
