var React = require('react');
var TodoStore = require('../../stores/TodoStore');
var TodoCard = require('./TodoCard.jsx');

function getStateFromStores() {
    return {
        todos: TodoStore.getAll()
    };
}

var TodoCardContainer = React.createClass({
    getInitialState: function () {
        return getStateFromStores();
    },

    componentDidMount: function () {
        TodoStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        TodoStore.removeChangeListener(this._onChange);
    },

    render: function () {
        return (
            <TodoCard todos={this.state.todos} />
        );
    },

    _onChange: function () {
        this.setState(getStateFromStores());
    }
});

module.exports = TodoCardContainer;
