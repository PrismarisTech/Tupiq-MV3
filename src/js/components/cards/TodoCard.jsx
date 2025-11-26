var React = require('react');
var TodoActions = require('../../actions/TodoActions');
var classNames = require('classnames');

var ENTER_KEY_CODE = 13;

var TodoItem = React.createClass({
    getInitialState: function () {
        return {
            isEditing: false
        };
    },

    render: function () {
        var todo = this.props.todo;

        var itemClass = classNames({
            'completed': todo.complete
        });

        return (
            <li className={itemClass}>
                <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.complete}
                    onChange={this._onToggleComplete}
                />
                <label onDoubleClick={this._onDoubleClick}>
                    {todo.text}
                </label>
                <button className="destroy" onClick={this._onDestroy}></button>
            </li>
        );
    },

    _onToggleComplete: function () {
        TodoActions.toggleComplete(this.props.todo);
    },

    _onDestroy: function () {
        TodoActions.destroy(this.props.todo.id);
    },

    _onDoubleClick: function () {
        this.setState({ isEditing: true });
    }
});

var TodoCard = React.createClass({
    getInitialState: function () {
        return {
            newTodoText: ''
        };
    },

    render: function () {
        var todos = this.props.todos;
        var todoItems = [];

        for (var key in todos) {
            todoItems.push(<TodoItem key={key} todo={todos[key]} />);
        }

        var cardClassName = classNames({
            'card': true,
            'todo': true
        });

        return (
            <div className={cardClassName}>
                <input
                    className="new-todo"
                    placeholder="What needs to be done?"
                    value={this.state.newTodoText}
                    onChange={this._onChange}
                    onKeyDown={this._onKeyDown}
                    autoFocus={true}
                />
                {todoItems.length > 0 ? (
                    <ul className="todo-list">
                        {todoItems}
                    </ul>
                ) : null}
            </div>
        );
    },

    _onChange: function (event) {
        this.setState({
            newTodoText: event.target.value
        });
    },

    _onKeyDown: function (event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            var val = this.state.newTodoText.trim();
            if (val) {
                TodoActions.create(val);
                this.setState({ newTodoText: '' });
            }
        }
    }
});

module.exports = TodoCard;
