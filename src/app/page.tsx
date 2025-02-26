'use client'
import Image from "next/image";
import { useState, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
} 

const Todo = () => {

  const [task, setTask] = useState<Task[]>([]);
  const [filter, setFilter] = useState('All')
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
      const storedTask = localStorage.getItem('tasks') !== null ? JSON.parse(localStorage.getItem('tasks')!) : [];
      setTask(storedTask)
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(task))
  }, [task])


  const filteredTask = task.filter(task => {
    if(filter === 'Completed') return task.completed;
    if(filter === 'Pending') return !task.completed;
    return true
  }) 

  const addTask = () => {
    if(newTask.trim()) {
      const updatedTask = [...task, {id: Date.now(), text: newTask, completed: false}]
      setTask(updatedTask)
      setNewTask('')
    }
  }

  const toggleTask = (id: number) => {
    const updatedTask = task.map(task => task.id === id ? { ...task, completed: !task.completed} : task)
    setTask(updatedTask)
  }

  const onDeleteTask = (id: number) => {
    const updatedTask = task.filter(task => task.id !== id )
    setTask(updatedTask)
  }

  const removeTasks = () => {
    setTask([])
    localStorage.removeItem('tasks')
  }


  return (
    <div className="p-6 max-w-[800px] mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="flex space-x-2">
        <input className="border p-2 flex-grow rounded-lg text-black" placeholder="Add something....." value={newTask} onChange={(e) => setNewTask(e.target.value)}></input>
        <button className={`bg-blue-500 px-4 py-2 rounded-lg text-white ${newTask === '' && 'disabled: bg-gray-400 cursor-not-allowed'}` } onClick={() => addTask()}>Add</button>
        {task.length > 0 && <button className={`bg-red-600 px-4 py-2 rounded-lg text-white` } onClick={() => removeTasks()}>Clear</button>}
      </div>

      <div className="bg-white border-black space-x-2 flex">
        {
          ['All', 'Completed', 'Pending'].map((status) => {
            return (
              <button key={status} className={`px-4 py-2 rounded ${filter === status ? 'bg-black text-white' : 'text-black bg-white border'}`} onClick={() => setFilter(status)}>{status}</button>
            )
          })
        }

      </div>
      
      { task.length === 0 ? <Image width={20} height={30} src="/loader.svg" alt="SVG Logo" className="w-16 h-16" /> : 
      <div className="relative  border border-grey rounded pb-4">
      <ul>
        {filteredTask.map((task) => {
          return(
            <li key={task.id} className="flex items-center justify-between p-2 border rounded m-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" checked={task.completed} onChange={() => {toggleTask(task.id)}}></input>
                <span className={`${task.completed ? 'line-through text-black' : 'text-black'}`}>{task.text}</span>
              </div>
              <button className="text-red-500" onClick={() => {onDeleteTask(task.id)}}>Delete</button>
            </li>
          )
        })

        }
      </ul>
      <div className=" absolute -bottom-3 right-2 rounded  bg-white px-2 text-gray-600 mt-4">{task.filter(task => task.completed).length} of {task.length} completed</div>
      </div>}


    </div>

  )

}

export default Todo