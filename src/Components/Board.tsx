import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DraggableCard";
import { IToDo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import { useState } from "react";

const Wrapper = styled.div<{ active: boolean }>`
  width: 280px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 10px;
  min-height: 300px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);
`;
const BoardTop = styled.div`
  width: 100%;
  position: relative;
  padding: 15px 20px;
  display: flex;
`;
const Title = styled.h2<{ active: boolean }>`
  font-size: 1.6rem;
  font-weight: 600;
  width: ${(props) => (props.active ? "70%" : "100%")};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: width 0.3s ease 0s;
`;
const Buttons = styled.div<{ active: boolean }>`
  display: flex;
  gap: 2px;
  position: absolute;
  right: 1rem;
  opacity: ${(props) => (props.active ? 1 : 0)};
  transition: opacity 0.3s;
`;
const Button = styled.button`
  padding: 0;
  border: none;
  width: 2rem;
  cursor: pointer;
`;
const Icon = styled.span`
  padding: 5px;
  border-radius: 0.2rem;
  transition: background-color 0.3s;
  :hover {
    background-color: #d7d7d7;
  }
`;
const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  height: 3.5rem;
  display: flex;
  justify-content: center;
  border-top: 2px solid rgba(0, 0, 0, 0.15);
  border: none;
  input {
    font-size: 16px;
    border: 0;
    background-color: white;
    color: ${(props) => props.theme.textColor};
    flex-grow: 1;
    padding: 10px 24px;
    border-radius: 0 0 0.6rem 0.6rem;
    outline: none;
    border: none;
    transition: background-color 0.3s, color 0.3s;
  }
  input:placeholder-shown {
    text-overflow: ellipsis;
  }
  input:focus {
    background-color: #5e5e5ef8;
    color: #fff;
    ::placeholder {
      color: #fff;
    }
  }
`;

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
}

export interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const [active, setActive] = useState(false);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };

  const onEdit = (boardId: string) => {
    const newBoardId = window.prompt("Enter the board name to edit", boardId);
    if (newBoardId === boardId) {
      alert("기존 리스트와 이름이 겹칩니다");
      return;
    }
    if (newBoardId === "") {
      alert("반드시 이름을 입력해야합니다.");
      return;
    }
    if (newBoardId !== null) {
      setToDos((allBoards) => {
        const reminder = Object.keys(allBoards).filter(
          (board) => board !== boardId
        );
        let boards = {};
        const oldBoards = reminder.map((board) => {
          boards = { ...boards, [board]: allBoards[board] };
        });
        oldBoards.map(() => {
          boards = { ...boards, [newBoardId]: allBoards[boardId] };
        });
        return { ...boards };
      });
    }
  };

  const onDelete = (boardId: string) => {
    setToDos((allBoards) => {
      const boardsList = Object.keys(allBoards).filter(
        (board) => board !== boardId
      );
      let boards = {};
      boardsList.map((board) => {
        boards = { ...boards, [board]: allBoards[board] };
      });

      return { ...boards };
    });
  };

  return (
    <Wrapper
      onMouseOver={() => setActive(true)}
      onMouseOut={() => setActive(false)}
      active={active}
    >
      <BoardTop>
        <Title active={active}>{boardId}</Title>
        <Buttons active={active}>
          <Button onClick={() => onEdit(boardId)}>
            <Icon className="material-symbols-outlined">edit</Icon>
          </Button>
          <Button onClick={() => onDelete(boardId)}>
            <Icon className="material-symbols-outlined">delete</Icon>
          </Button>
          {/* <Button>
            <Icon className="material-symbols-outlined">drag_handle</Icon>
          </Button> */}
        </Buttons>
      </BoardTop>

      <Droppable droppableId={boardId}>
        {(magic, info) => (
          <Area
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
                boardId={boardId}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
    </Wrapper>
  );
}
export default Board;
