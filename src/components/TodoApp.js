import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import Footer from './Footer'
import { saveTodo, loadTodos, destroyTodo, updateTodo } from '../lib/service'
import { filterTodos } from '../lib/utils';

export default class TodoApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentTodo: '',
      todos: [
        {
          "id": 1,
          "name": "Buy Milk",
          "isComplete": false
        },
        {
          "id": 2,
          "name": "Buy Eggs",
          "isComplete": true
        },
        {
          "id": 3,
          "name": "Buy Bread",
          "isComplete": false
        },
        {
          "id": 4,
          "name": "Make French Toast",
          "isComplete": false
        }
      ]
    }

    this.handleNewTodoChange = this.handleNewTodoChange.bind(this)
    this.handleTodoSubmit = this.handleTodoSubmit.bind(this)
    this.handleRemoveTodo = this.handleRemoveTodo.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentDidMount() {
    loadTodos()
      .then(({data}) => {
        this.setState({todos: data, error: false})
      })
      .catch(err => {
        console.log(`Load todos fail: ${err}`)
        this.setState({error: true})
      })
  }

  handleNewTodoChange(evt) {    
    this.setState({currentTodo: evt.target.value})
  }

  handleTodoSubmit(evt) {
    evt.preventDefault()
    const newTodo = {name : this.state.currentTodo, isComplete: false}
    saveTodo(newTodo)
      .then(({data}) => {
        this.setState({
          todos: this.state.todos.concat(data),
          currentTodo: ''
        })
      })
      .catch((err) => {
        this.setState({error: true})
        console.log("Submit failed: " + err)
      })
  }

  handleRemoveTodo(id) {
    destroyTodo(id)
      .then(() => {
        this.setState({
          todos: this.state.todos.filter(t => t.id != id)
        })
      })    
  }

  handleToggle(id) {
    const targetTodo = this.state.todos.find(t => t.id === id)
    const update = {
      ...targetTodo,
      isComplete: !targetTodo.isComplete
    }

    updateTodo(update)
      .then(({data}) => {
        const todos = this.state.todos.map(
          t => t.id === data.id ? data : t
        )

        this.setState({todos: todos})
      })
    
  }



  render () {
    const remainingTodos = this.state.todos.filter(todo => !todo.isComplete).length
    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error ? <span className='error'>Oh no!</span> : ''}
            <TodoForm currentTodo={this.state.currentTodo} 
              handleNewTodoChange={this.handleNewTodoChange} 
              handleTodoSubmit={this.handleTodoSubmit}
            />
          </header>
          <section className="main">
            <Route path='/:filter?' render={({match}) => 
              <TodoList todos={filterTodos(match.params.filter, this.state.todos)} 
                handleRemoveTodo={this.handleRemoveTodo}
                handleToggle={this.handleToggle}
              />
            } />
          </section>
          <Footer remainingTodos={remainingTodos} />
        </div>
      </Router>
    )
  }
}
