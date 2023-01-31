import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    toDo: [
      { text: "해야할일을", id: 0 },
      { text: "직접", id: 1 },
      { text: "만들어보세요", id: 2 },
      { text: "만든 ", id: 3 },
      { text: "할일 다하면", id: 4 },
      { text: "드래그해서", id: 5 },
      { text: "Done 리스트에", id: 6 },
      { text: "옮겨보세요", id: 7 },
      { text: "이건 이름이 되게 긴데 마우스를 여기에도 올려보세요", id: 8 },
    ],
    Done: [],
  },
});
