import React, { Component } from "react";
import {
  Button,
  Form,
  TextArea,
  Icon,
  Table,
  Label,
  Header
} from "semantic-ui-react";
import moment from "moment";

export default class Notes extends Component {
  state = {
    todoName: "",
    table: []
  };
  constructor(props) {
    super(props);

    let table = JSON.parse(localStorage.getItem("tableNotes"));

    if (table) this.state.table = table;

    this.handleChange = this.handleChange.bind(this);
    this.onRemoveTodo = this.onRemoveTodo.bind(this);
    this.onUpdateTodo = this.onUpdateTodo.bind(this);
  }
  onAddTodoForm = event => {
    event.preventDefault();
    this.onAddTodo();
  };
  onAddTodo = () => {
    const { todoName, table } = this.state;
    if (todoName) {
      table.push({ status: 1, name: todoName, date: Date.now() });
      this.setState({ todoName: "" });
      this.saveTable(table);
    }
  };
  onRemoveTodo = date => {
    const { table } = this.state;
    let tableNew = table.filter(x => x.date !== date);
    this.saveTable(tableNew);
  };
  onUpdateTodo = date => {
    const { table } = this.state;

    let index = table.findIndex(x => x.date === date);
    if (table[index].status === 1) table[index].status = 2;
    else table[index].status = 1;

    this.saveTable(table);
  };
  saveTable = table => {
    this.setState({ table });
    localStorage.setItem("tableNotes", JSON.stringify(table));
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  render() {
    const { todoName, table } = this.state;
    return (
      <div>
        <Header>Notes</Header>
        <Form onSubmit={this.onAddTodoForm}>
          <TextArea
            value={todoName}
            name="todoName"
            onChange={this.handleChange}
            icon={
              <Icon
                onClick={() => this.onAddTodo()}
                name="add"
                inverted
                circular
                link
              />
            }
            placeholder="Note..."
          />
          <Button onClick={() => this.onAddTodo()}>Add</Button>
        </Form>
        <Table celled>
          <Table.Body>
            {table.map(({ name, date, status }) => (
              <TableRow
                key={"row_" + date}
                name={name}
                date={date}
                status={status}
                onUpdateTodo={this.onUpdateTodo}
                onRemoveTodo={this.onRemoveTodo}
              />
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

const TableStatuses = {
  1: { name: "Added", color: "yellow" },
  2: { name: "Completed", color: "blue" }
};

const TableRow = ({ name, date, status, onRemoveTodo, onUpdateTodo }) => (
  <Table.Row>
    <Table.Cell collapsing>
      <Label
        as="a"
        basic
        color={TableStatuses[status].color}
        onClick={() => onUpdateTodo(date)}
      >
        {TableStatuses[status].name}
      </Label>
    </Table.Cell>
    <Table.Cell>{name}</Table.Cell>
    <Table.Cell title={moment(date).fromNow()} collapsing>
      <Label color="violet">
        {moment(date)
          .format("DD-MM-YYYY HH:mm")
          .replace(moment().format("DD-MM-YYYY "), "")}
      </Label>
    </Table.Cell>
    <Table.Cell collapsing>
      <Icon
        onClick={() => onRemoveTodo(date)}
        name="remove"
        inverted
        circular
        link
      />
    </Table.Cell>
  </Table.Row>
);
