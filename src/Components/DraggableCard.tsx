import React, { FormEvent, useEffect,  useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import {  useSetRecoilState } from "recoil";
import styled from "styled-components";
import { IToDo, toDoState } from "../atoms";
import { IForm } from "./Board";

const Card = styled.div<{ active: boolean }>`
  border-radius: 0.4rem;
  margin-bottom: 10px;
  padding: 13px 11px;
  height: 2.75rem;
  background-color: ${(props) => props.theme.cardColor};
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);
  position: relative;
  display: flex;
  div:first-child {
    width: ${(props) => (props.active ? "75%" : "100%")};
    transition: width 0.2s;
    font-size: 1rem;
    text-overflow: ellipsis;
    overflow-x: clip;
    white-space: nowrap;
  }
`;

const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  input {
    border-radius: 0.4rem;
    padding: 10px 10px;
    background-color: ${(props) => props.theme.cardColor};
    flex-grow: 1;
    font-size: inherit;
    outline: none;
    border: none;
  }
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

const Buttons = styled.div<{ active: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 3px;
  position: absolute;
  top: 0;
  right: 0.5rem;
  height: 100%;
  opacity: ${(props) => (props.active ? 1 : 0)};
  transition: opacity 0.2s;
`;
const Button = styled.button`
  cursor: pointer;
  background: none;
  margin: 0 auto;
  padding: 0;
  text-align: center;
  border: none;
`;

const Icon = styled.span`
  vertical-align: bottom;
  border-radius: 0.2rem;
  padding: 2px;
  transition: background-color 0.3s;
  :hover {
    background-color: #d7d7d7;
  }
`;
function DraggableCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDraggableCardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const [isHidden, setHidden] = useState(true);
  const [active, setActive] = useState(false);
  const { register, handleSubmit, setValue, setFocus } = useForm<IForm>();

  const onEdit = () => {
    setHidden((isHidden) => !isHidden);
    setFocus("toDo", { shouldSelect: true });
  };

  const onSubmit = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((prev) => {
      const EditCard = [...prev[boardId]];
      const EditCardIndex = EditCard.findIndex((data) => data.id === toDoId);
      EditCard[EditCardIndex] = newToDo;
      return {
        ...prev,
        [boardId]: EditCard,
      };
    });
    setValue("toDo", "");
  };

  const onDelete = () => {
    setToDos((prev) => {
      const deleteCard = [...prev[boardId]];
      const deleteCardIndex = deleteCard.findIndex(
        (data) => data.id === toDoId
      );
      deleteCard.splice(deleteCardIndex, 1);
      return { ...prev, [boardId]: deleteCard };
    });
  };

  useEffect(() => {
    setFocus("toDo");
  }, [isHidden]);
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic) => (
        <Card
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
          onMouseOver={() => setActive(true)}
          onMouseOut={() => setActive(false)}
          active={active}
        >
          <div>{toDoText}</div>
          {isHidden ? (
            ""
          ) : (
            <Form onSubmit={handleSubmit(onSubmit)}>
              <input
                defaultValue={toDoText}
                {...register("toDo", { required: true })}
                type="text"
              />
            </Form>
          )}

          <Buttons active={active}>
            <Button onClick={onEdit}>
              <Icon className="material-symbols-outlined">edit</Icon>
            </Button>
            <Button onClick={onDelete}>
              <Icon className="material-symbols-outlined">delete</Icon>
            </Button>
          </Buttons>
        </Card>
      )}
    </Draggable>
  );
}
export default React.memo(DraggableCard);
