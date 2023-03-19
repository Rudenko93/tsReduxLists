import { useState } from "react"
import { addTodoThunk } from "../../store/slices"
import { useAppDispatch } from "../../hook"

export const Input: React.FC = () => {
  const [title, setTitle] = useState("")

  const dispatch = useAppDispatch()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title) {
      return
    }
    dispatch(addTodoThunk(title))
    setTitle("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  )
}
