import { useAppDispatch } from "../../hook"

import { deleteTodoThunk, toggleTodoThunk } from "../../store"

interface TodoItemProps {
  id: number
  title: string
  done: boolean
}

export const TodoItem: React.FC<TodoItemProps> = ({ id, title, done }) => {
  const dispatch = useAppDispatch()

  const handleDeleteTodoThunk = (id: number) => {
    dispatch(deleteTodoThunk(id))
  }

  const handleToggleTodoThunk = (id: number) => {
    dispatch(toggleTodoThunk(id))
  }

  return (
    <>
      <div
        key={id}
        style={done ? { textDecoration: "line-through" } : undefined}>
        <input
          type="checkbox"
          checked={done}
          onClick={() => handleToggleTodoThunk(id)}
          onChange={() => {}}
        />
        {title}

        <button
          style={{ outline: "none", marginLeft: 6 }}
          onClick={() => handleDeleteTodoThunk(id)}>
          x
        </button>
      </div>
    </>
  )
}
