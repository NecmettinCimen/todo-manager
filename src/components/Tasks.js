import React, { Component } from "react";
import { Header, Input, Icon, Table, Label } from "semantic-ui-react";
import moment from "moment";
import QRCode from 'qrcode.react'
import QrReader from 'react-qr-reader'


export default class Tasks extends Component {
  state = {
    todoName: "",
    table: [],
    tableStr: "",
    qrenabled: false,
    searchStatus: 1
  };
  constructor(props) {
    super(props);

    let table = JSON.parse(localStorage.getItem("table"));

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
    const tableStr = JSON.stringify(table);
    this.setState({ table, tableStr });
    localStorage.setItem("table", tableStr);
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleScan = data => {
    if (data) {
      this.setState({
        tableStr: data
      })
    }
  }
  handleError = err => {
    console.error(err)
  }

  filterTasks = (searchStatus) => {
    this.setState({ searchStatus })
  }

  render() {
    const { todoName, table, tableStr, qrenabled, searchStatus } = this.state;
    return (
      <div>
        <Header><span style={{ color: searchStatus === 1 ? 'black' : '#eee', cursor: 'pointer' }} onClick={() => this.filterTasks(1)}>Tasks </span>
          <span style={{ color: searchStatus === 2 ? 'black' : '#eee', cursor: 'pointer' }} onClick={() => this.filterTasks(2)} > Completed Task</span></Header>
        <form autoComplete="off" onSubmit={this.onAddTodoForm}>
          <Input
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
            fluid
            placeholder="Todo Name..."
          />
        </form>
        <Table celled>
          <Table.Body>
            {table.filter(x => x.status === searchStatus).map(({ name, date, status }) => (
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
        {
          qrenabled ? <div style={{ flex: 1 }}>
            <QRCode value={tableStr}
              style={{ height: 300, width: 300, float: "left" }}
            />
            <div
              style={{ height: 300, width: 300, float: "right" }}
            >

              <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '100%' }}
              />
            </div>
          </div> : null
        }
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
