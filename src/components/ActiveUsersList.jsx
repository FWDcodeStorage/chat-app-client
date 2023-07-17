import { useEffect, useState, useRef } from "react";

const ActiveUsersList = ({ socket }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const lastUserRef = useRef(null);

  useEffect(() => {
    // 👇️ scroll to bottom every time user change
    lastUserRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeUsers]);

  const leaveChat = () => {
    localStorage.removeItem("username"); // Remove username from localStorage
    window.location.reload();
  };

  useEffect(() => {
    socket.on("newUsers", (data) => {
      setActiveUsers(data);
    });

    socket.emit("getActiveUsers");

    return () => {
      socket.off("newUsers");
    };
  }, [socket]);

  return (
    <div className='active_users absolute top-[12%] right-0 xl:w-[30%] lg:w-[35%] md:w-[50%] sm:w-[60%] w-[90%] z-10 h-[90%] bg-[#2b2b2b] border-2 border-[#67ff4f] sm:px-[2em] px-[1em] sm:py-[2em] py-[.5em] flex flex-col justify-between items-center'>
      <p className='uppercase sm:text-lg text-md font-bold tracking-wider text-[#67ff4f] mb-[4em]'>
        <strong>active users</strong>
      </p>
      <div className='list_of_active w-full flex flex-col items-center gap-[2em] overflow-y-scroll'>
        {Array.isArray(activeUsers) && activeUsers.length > 0 ? (
          activeUsers.map((user, index) => (
            <p key={user.username} className='w-full text-center py-[.5em]'
            ref={index === activeUsers.length - 1 ? lastUserRef : null}>
             {user.username}
            </p>
          ))
        ) : (
          <p className='w-full text-center py-[.5em]'>No active users</p>
        )}
      </div>
      <div className='logout w-full'>
        <button
          className='logOutBtn w-full sm:text-lg text-md uppercase border-2 border-[#67ff4f] bg-[#67ff4f] text-white hover:bg-transparent py-[0.5em] rounded-sm font-bold tracking-wider'
          onClick={leaveChat}
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default ActiveUsersList;
