'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

export default function Page() {
  const room = 'general';
  const { user } = useAuth();
  const { selectedUser } = useUser();
  const [users, setUsers] = useState<User[]>([])

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");

  const getMessages = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/auth/getMessages');
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }

      const data = await response.json();

      setMessages(data);

    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {

    getMessages();

    if (!selectedUser || !user) return;

    socket.emit("join-room", selectedUser.id);
    socket.emit("join-room", user.id);
    console.log("Usuário conectado ao socket:", user);

    socket.on("message", (msg) => {
      console.log("Mensagem recebida:", msg);

      setMessages((prev) => [...prev, msg]);
      getMessages();
    });

    return () => {
      socket.off("message");
    };
  }, [selectedUser, user]);

  const sendMessage = async () => {
    if (!messageContent.trim()) return;
  
    let newMessage: Message = {
      to: selectedUser as User,
      sender: user as User,
      content: messageContent,
    };
  
    try {
      const response = await fetch('http://localhost:8888/api/auth/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao enviar a mensagem');
      }
  
      socket.emit("message", { to: selectedUser, message: newMessage });
      setMessageContent("");

      setMessages((prev) => [...prev, newMessage]);
      getMessages();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/auth/users');
        if (!response.ok) {
          throw new Error('Erro ao buscar usuários');
        }
  
        const data = await response.json();
        setUsers(data.map((user: any) => ({ ...user, stats: 2 })));
  
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
  
    fetchUsers();
  
    socket.on('users-online', (onlineUsers: User[]) => {

      setUsers(prevUsers => 
        prevUsers.map(user => ({
          ...user,
          stats: onlineUsers.some(onlineUser => onlineUser.id === user.id) ? 1 : 2
        }))
      );
    });
  
    return () => {
      socket.off('users-online');
    };
  }, []);

  const filteredMessages = messages.filter((message) => 
    (message.from_user_id === user?.id && message.to_user_id === selectedUser?.id) || 
    (message.from_user_id === selectedUser?.id && message.to_user_id === user?.id)
  );

    return (
      selectedUser && (
        <main className="flex flex-col justify-between bg-white min-h-96  h-full w-full flex-1">
          <header className="flex items-center justify-between p-4 bg-gray-300  text-gray-800 font-bold">
            <p>{selectedUser?.name}  </p>
              { /* não consegui colocar o status embaixo do nome no header
              {user?.stats === 1} && (
                <p>Online</p>
              )
              {user?.stats === 2} && (
                <p>Offline</p>
              ) */}
          </header>
          <div className="flex flex-col w-full p-1 text-white overflow-y-auto">
          {filteredMessages.map((message, index) => {
              const showName = index === 0 || message.from_user_id !== filteredMessages[index - 1].from_user_id;

              return (
                  <div key={index} className={`flex flex-row ${message.from_user_id === user?.id ? "justify-end pl-20" : "justify-start pr-20"}`}>
                      <div className={`mt-1 ${message.from_user_id === user?.id ? "bg-gray-600 rounded-l-lg" : "bg-gray-400 rounded-r-lg"} w-fit`}>
                          {showName && (
                              <span className="  p-2 font-bold text-gray-800">
                                  ~ {message.username}
                              </span>
                          )}
                          <p className="px-2 mt-0 p-1 font-medium text-white rounded-md w-fit text-align-left break-all   ">
                              {message.message}
                          </p>
                      </div>
                  </div>
              );

          })}
          </div>
          <div className="mt-2 flex bg-white " >
            <input
              className="p-2 m-2 text-black bg-gray-200 border border-gray-300 outline-none rounded-lg w-full"
              type="text"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Mensagem"
            />
            
            <button className="bg-gray-600  rounded p-2 m-2 w-40" onClick={sendMessage}>
              Enviar
            </button>
            </div>
        </main>
      )
    );
}
