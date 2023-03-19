import { useEffect } from "react"
import { useAppDispatch } from "../../hook"
import { useAppSelector } from "../../hook"
import { loadTodosThunk } from "../../store"

import { TodoItem } from "../TodoItem"

export const TodoList: React.FC = () => {
  const items = useAppSelector((state) => state.slice.items)
  const status = useAppSelector((state) => state.slice.status)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadTodosThunk())
  }, [dispatch])

  const render = () => {
    switch (status) {
      case "loading":
        return <h1>Loading...</h1>
      case "error":
        return <h1>error...</h1>
      case "success":
        return items.map((item) => <TodoItem key={item.id} {...item} />)
    }
  }

  return <>{render()}</>
}
