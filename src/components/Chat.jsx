import { useEffect, useState, useRef } from "react";
import Images from "../Images";
import ActiveUsersList from "./ActiveUsersList";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const Chat = ({ username, room, socket }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showActiveUsers, setShowActiveUsers] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const lastMessageRef = useRef(null);

  //take active users from server
  useEffect(() => {
    socket.on("newUsers", (data) => {
      setShowActiveUsers(data);
    });
  }, [socket]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setMessage(message + emoji);
    setShowEmoji(!showEmoji);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message !== "") {
      const messageInfo = {
        username: username,
        message: message,
        room: room,
        time: new Date().toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
        }),
      };

      //added this, so we can see the message we sent on the screen as well as the received message
      setMessageList((prevMessageList) => [
        ...prevMessageList,
        {
          username: messageInfo.username,
          room: messageInfo.room,
          time: messageInfo.time,
          message: messageInfo.message,
        },
      ]);

      await socket.emit("send_message", messageInfo);

      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((prevMessageList) => [
        ...prevMessageList,
        {
          username: data.username,
          room: data.room,
          time: data.time,
          message: data.message,
        },
      ]);
    });

    //cleanup function is defined to remove the event listener when the component unmounts using socket.off("receive_message")
    //This ensures that the event listener is only registered once and prevents multiple instances of the event handler from being active, which could result in receiving duplicate messages.
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <div className='chat relative w-[95vw] h-[95vh] bg-[#2b2b2b] my-[1em] sm:px-[1em] overflow-hidden text-white border-2 border-[#67ff4f] rounded-md'>
      <div className='chat-header h-[12%] py-[.3em] w-full border-b-2 border-b-[#67ff4f] flex justify-between items-center'>
        <img src={Images.logo} alt='logo' className='max-h-[3em]' />
        <h1 className='text-[.7rem] uppercase tracking-wider text-gray-500'>
          🚪{room}
        </h1>
        <img
          src={Images.usersLogo}
          onClick={() => setShowActiveUsers(!showActiveUsers)}
          alt='active-users'
          className='md:h-[3em] h-[2em] hover:transition-all hover:scale-75'
        />
      </div>

      <div className='chat-body overflow-y-scroll rounded-md w-full sm:h-[65%] h-[70%] p-[1em] mb-[.5em] flex flex-col gap-2'>
        {messageList.map((msg, index) => (
          <div
            key={index}
            className={` msg-box w-fit flex flex-col rounded-md py-1 px-2 sm:text-base text-sm tracking-wide font-light ${
              username === msg.username ? "bg-gray-500" : "bg-green-300"
            }`}
            style={{
              alignSelf: username === msg.username ? "flex-start" : "flex-end",
              textAlign: username === msg.username ? "start" : "end",
            }}
            ref={index === messageList.length - 1 ? lastMessageRef : null}
          >
            <div className='msg'>
              <p>{msg.message}</p>
            </div>
            <div className='meta text-xs font-extralight text-gray-400'>
              <p>
                {msg.username} <span>{msg.time}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className='chat-footer h-[20%]  w-full border border-[#67ff4f] hover:shadow-lg hover:shadow-[#67ff4f85] rounded-md flex'>
        <form onSubmit={sendMessage} className='flex gap-2 w-full'>
          <div className='w-full rounded-sm relative flex items-end'>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Type...'
              className='h-full outline-none sm:w-[90%] w-full bg-transparent px-[.2em] sm:text-lg tracking-wide text-md'
              cols='30'
              rows='3'
            ></textarea>

            <span
              onClick={() => setShowEmoji(!showEmoji)}
              className='cursor-pointer sm:text-[1.5rem] text-sm'
            >
              😄
            </span>

            {showEmoji && (
              <div className='absolute bottom-[100%] right-0'>
                <Picker
                  data={data}
                  emojiSize={24}
                  emojiButtonSize={28}
                  onEmojiSelect={addEmoji}
                  maxFrequentRows={0}
                />
              </div>
            )}
          </div>

          <button
            className='sm:w-[10%] w-fit h-full  text-white flex justify-center items-center px-[.2em]'
            type='submit'
          >
            <img
              src={Images.sendBtn}
              alt='send'
              className='sm:h-[4em] h-[3em] hover:transition-all hover:scale-75'
            />
          </button>
        </form>
      </div>

      {/* active users div */}
      {showActiveUsers && <ActiveUsersList socket={socket} />}
    </div>
  );
};

export default Chat;
