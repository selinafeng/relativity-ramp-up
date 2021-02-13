import { setupMaster } from "cluster";

// example consuming code
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default Todo;
