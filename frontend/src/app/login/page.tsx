"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, error } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <main className="w-full">
      <div className="flex flex-col max-w-md p-4 mx-auto text-center text-black bg-white rounded">
        <h1 className="mb-4 text-lg font-bold">Login Page</h1>
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={handleLogin}
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 text-black bg-white border border-gray-300 rounded outline-none"
            type="text"
            placeholder="Digite seu email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-black bg-white border border-gray-300 rounded outline-none"
            type="password"
            placeholder="Digite sua senha"
          />
          <button
            className="px-4 py-2 font-bold text-white bg-gray-600 rounded max-w-32"
            type="submit"
          >
            Login
          </button>
          <p>Não tem uma conta?</p>
          <a className="text-blue-400" href="/register">Clique aqui</a>

          <p className="text-red-400">{error?.message}</p>
        </form>
      </div>
    </main>
  );
};

export default Page;
