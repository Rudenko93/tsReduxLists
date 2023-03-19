import { Input } from "./components/Input"
import { TodoList } from "./components/TodoList"
import "./App.css"

function App() {
  return (
    <div>
      <h1>Todos</h1>
      <Input />
      <TodoList />
    </div>
  )
}
export default App
