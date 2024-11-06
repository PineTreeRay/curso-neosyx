interface Boardgame {
  id: string;
  name: string;
  image: string;
  available: boolean;
}

type BoardgameProps = {
  boardgame: Boardgame;
};
