import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [modalInput, setModalInput] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark-mode')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    if (newTheme) {
      document.documentElement.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = 
      filter === 'ALL' ||
      (filter === 'COMPLETE' && todo.completed) ||
      (filter === 'INCOMPLETE' && !todo.completed)
    return matchesSearch && matchesFilter
  })

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const openAddModal = () => {
    setEditingTodo(null)
    setModalInput('')
    setIsModalOpen(true)
  }

  const openEditModal = (todo) => {
    setEditingTodo(todo)
    setModalInput(todo.text)
    setIsModalOpen(true)
  }

  const saveNote = () => {
    if (!modalInput.trim()) return

    if (editingTodo) {
      setTodos(todos.map(todo =>
        todo.id === editingTodo.id ? { ...todo, text: modalInput.trim() } : todo
      ))
    } else {
      const newTodo = {
        id: Date.now(),
        text: modalInput.trim(),
        completed: false
      }
      setTodos([...todos, newTodo])
    }
    setIsModalOpen(false)
    setModalInput('')
    setEditingTodo(null)
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const cancelModal = () => {
    setIsModalOpen(false)
    setModalInput('')
    setEditingTodo(null)
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">TODO LIST</h1>
        <div className="control-bar">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="filter-container">
            <button 
              className="filter-button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {filter}
              <svg className="dropdown-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {isFilterOpen && (
              <>
                <div className="dropdown-overlay" onClick={() => setIsFilterOpen(false)}></div>
                <div className="filter-dropdown">
                  <button 
                    className={`filter-option ${filter === 'ALL' ? 'active' : ''}`}
                    onClick={() => { setFilter('ALL'); setIsFilterOpen(false); }}
                  >
                    All
                  </button>
                  <button 
                    className={`filter-option ${filter === 'COMPLETE' ? 'active' : ''}`}
                    onClick={() => { setFilter('COMPLETE'); setIsFilterOpen(false); }}
                  >
                    Complete
                  </button>
                  <button 
                    className={`filter-option ${filter === 'INCOMPLETE' ? 'active' : ''}`}
                    onClick={() => { setFilter('INCOMPLETE'); setIsFilterOpen(false); }}
                  >
                    Incomplete
                  </button>
                </div>
              </>
            )}
          </div>

          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? (
              <svg className="sun-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 3V1M10 19V17M17 10H19M1 10H3M15.657 4.343L17.071 2.929M2.929 17.071L4.343 15.657M15.657 15.657L17.071 17.071M2.929 2.929L4.343 4.343" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg className="moon-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.293 13.293C16.3785 13.8171 15.3507 14.1073 14.293 14.1073C10.2269 14.1073 6.92969 10.8101 6.92969 6.74397C6.92969 5.68629 7.21988 4.65849 7.744 3.74402C5.14589 4.69089 3.35938 7.19456 3.35938 10.1073C3.35938 13.8235 6.37684 16.841 10.0931 16.841C12.9958 16.841 15.4995 15.0645 16.4464 12.4664C16.4464 12.4664 16.4464 12.4664 17.293 13.293Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="main-content">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <img src="/empty.png" alt="Empty state" className="empty-illustration" />
            <p className="empty-text">Empty...</p>
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map(todo => (
              <li key={todo.id} className="todo-item">
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </span>
                <div className="todo-actions">
                  <button 
                    className="action-button edit-button"
                    onClick={() => openEditModal(todo)}
                    aria-label="Edit todo"
                  >
                    <img src="/pen-grey.png" alt="Edit" className="action-icon edit-icon-default" />
                    <img src="/pen-purple.png" alt="Edit" className="action-icon edit-icon-hover" />
                  </button>
                  <button 
                    className="action-button delete-button"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label="Delete todo"
                  >
                    <img src="/trash-grey.png" alt="Delete" className="action-icon delete-icon-default" />
                    <img src="/trash-red.png" alt="Delete" className="action-icon delete-icon-hover" />
                  </button>
      </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <button className="fab" onClick={openAddModal} aria-label="Add new todo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={cancelModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editingTodo ? 'EDIT NOTE' : 'NEW NOTE'}</h2>
            <input
              type="text"
              className="modal-input"
              placeholder="Input your note..."
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveNote()
                if (e.key === 'Escape') cancelModal()
              }}
              autoFocus
            />
            <div className="modal-actions">
              <button className="modal-button cancel-button" onClick={cancelModal}>
                CANCEL
              </button>
              <button className="modal-button apply-button" onClick={saveNote} disabled={!modalInput.trim()}>
                APPLY
        </button>
            </div>
          </div>
        </div>
      )}
      </div>
  )
}

export default App
