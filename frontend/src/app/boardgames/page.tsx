"use client";
import styles from "./page.module.css";

import { useEffect, useState } from "react";

const Page = () => {
  const [boardgames, setBoardgames] = useState([]);

  useEffect(() => {
    fetch("/api/boardgames")
      .then((res) => res.json())
      .then((data) => setBoardgames(data));
  }, []);



  return (
    <main>
      <h1>Boardgames</h1>
      {boardgames.map((boardgame: Boardgame, index) => (
        <div>
          <img className="max-w-xs" src={boardgame.image} alt="" />
          <p key={index}>{boardgame.name}</p>         
        </div>
      ))}
    </main>
  );
};

export default Page;
