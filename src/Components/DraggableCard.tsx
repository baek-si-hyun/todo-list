import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Card = styled.div`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) => props.theme.cardColor};
  box-shadow: 0px 3px 10px black;
  position: relative;
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}
const Buttons = styled.div`
  display: flex;
  gap: 2px;
  position: absolute;
  top: 0;
  right: 1rem;
`;
const Button = styled.div`
  cursor: pointer;
`;
function DraggableCard({ toDoId, toDoText, index }: IDraggableCardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const onClick = (event: any) => {
    console.log(event.currentTarget.index);
  };
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(magic) => (
        <Card
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoText}
          <Buttons>
            <Button onClick={onClick}>
              <span className="material-symbols-outlined">edit</span>
            </Button>
            <Button onClick={onClick}>
              <span className="material-symbols-outlined">delete</span>
            </Button>
            <Button onClick={onClick}>
              <span className="material-symbols-outlined">drag_handle</span>
            </Button>
          </Buttons>
        </Card>
      )}
    </Draggable>
  );
}
export default React.memo(DraggableCard);
