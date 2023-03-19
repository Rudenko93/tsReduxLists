import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  AnyAction,
} from "@reduxjs/toolkit"
import { getId } from "../utils/getId"

export type Todo = {
  id: number
  title: string
  done: boolean
}

type TodoState = {
  items: Todo[]
  status: "init" | "loading" | "error" | "success"
}

const initialState: TodoState = {
  items: [],
  status: "init",
}

const slice = createSlice({
  name: "todo",
  initialState,

  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload)
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTodosThunk.pending, (state) => {
        state.status = "loading"
      })
      .addCase(loadTodosThunk.fulfilled, (state, action) => {
        state.status = "success"
        state.items = action.payload
      })
      .addCase(loadTodosThunk.rejected, (state) => {
        state.status = "error"
      })
      .addCase(addTodoThunk.fulfilled, (state, action) => {
        state.status = "success"
        state.items.push(action.payload)
      })

      .addCase(toggleTodoThunk.fulfilled, (state, action) => {
        const toggledTodo = state.items.find(
          (todo) => todo.id === action.payload.id
        )
        if (toggledTodo) {
          toggledTodo.done = !toggledTodo.done
        }
      })
      .addCase(deleteTodoThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload)
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.status = "error"
        console.log(`type: ${action.type}, error text: ${action}`)
      })
  },
})

export const loadTodosThunk = createAsyncThunk<
  Todo[],
  undefined,
  { rejectValue: string }
>(
  "todo/get",

  async (_, { rejectWithValue }) => {
    const res = await fetch(process.env.REACT_APP_API_URL + "/posts")
    if (!res.ok) {
      return rejectWithValue("error: failed to fetch")
    }

    const json = await res.json()
    return json
  }
)

export const addTodoThunk = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string }
>(
  "todo/add",

  async (text, { rejectWithValue }) => {
    const todo = {
      title: text,
      id: getId(),
      done: false,
    }
    const res = await fetch(process.env.REACT_APP_API_URL + "/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })
    if (!res.ok) {
      return rejectWithValue("error: failed to add")
    }
    return (await res.json()) as Todo
  }
)

export const deleteTodoThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  "todo/delete",

  async (id, { rejectWithValue }) => {
    const res = await fetch(process.env.REACT_APP_API_URL + `/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      rejectWithValue("error: failed to delete")
    }
    return id
  }
)

export const toggleTodoThunk = createAsyncThunk<
  Todo,
  number,
  { rejectValue: string; state: { slice: TodoState } }
>(
  "todo/toggle",

  async (id, { rejectWithValue, getState }) => {
    const item = getState().slice.items.find((todo: Todo) => todo.id === id)
    if (!item) {
      return rejectWithValue("Can't delete task. Server error.")
    }

    const res = await fetch(process.env.REACT_APP_API_URL + `/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...item, done: !item.done }),
    })
    if (!res.ok) {
      rejectWithValue("error: failed to toggle")
    }
    return (await res.json()) as Todo
  }
)

export const { reducer: todoReducer, actions } = slice

function isError(action: AnyAction) {
  return action.type.endsWith("rejected")
}
