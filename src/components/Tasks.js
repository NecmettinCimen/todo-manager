import React, { Component } from "react";
import {
  Header,
  Input,
  Icon,
  Table,
  Label,
  Progress
} from "semantic-ui-react";
import moment from "moment";
import ReactNotifications from 'react-browser-notifications';

const colors = [
  'red',
  'orange',
  'olive',
  'green',
  'teal',
  'violet',
  'purple',
  'pink',
  'brown',
  'grey',
  'black',
]

export default class Tasks extends Component {
  state = {
    todoName: "",
    table: [],
    tableStr: "",
    qrenabled: false,
    searchStatus: 1,
    category: "",
    categories: []
  };
  constructor(props) {
    super(props);

    let table = JSON.parse(localStorage.getItem("table"));

    if (table) this.state.table = table;

    this.handleChange = this.handleChange.bind(this);
    this.onRemoveTodo = this.onRemoveTodo.bind(this);
    this.onUpdateTodo = this.onUpdateTodo.bind(this);

    this.showNotifications = this.showNotifications.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    this.showNotifications();
  }
  showNotifications() {
    if (this.n.supported()) this.n.show();
  }

  handleClick(event) {
    // Do something here such as
    // console.log("Notification Clicked") OR
    // window.focus() OR
    // window.open("http://www.google.com")

    this.n.close(event.target.tag);
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

  filterTasks = (searchStatus) => {
    this.setState({ searchStatus })
  }

  onAddCategory = event => {

    event.preventDefault();

    var { categories, category } = this.state

    categories.push({ name: category, color: colors[categories.length % colors.length] })

    this.setState({ categories })
  }

  render() {
    const { category, todoName, table, searchStatus, categories } = this.state;
    return (
      <div>
        <ReactNotifications
          onRef={ref => (this.n = ref)} // Required
          title={table.filter(x => x.status === searchStatus).length+ " Tasks !"} // Required
          body={moment('2019-12-01').fromNow().toLocaleUpperCase()}
          icon="icon.png"
          tag="abcdef"
          timeout="5000"
          onClick={event => this.handleClick(event)}
        />
        <Progress
          total={table.length}
          value={table.filter(x => x.status === 2).length}
          success active progress="ratio" />
        <Header><span style={{ color: searchStatus === 1 ? 'black' : '#eee', cursor: 'pointer' }}
          onClick={() => this.filterTasks(1)}>Tasks ({table.filter(x => x.status === 1).length}) </span>
          <span style={{ color: searchStatus === 2 ? 'black' : '#eee', cursor: 'pointer' }}
            onClick={() => this.filterTasks(2)} > Completed Task ({table.filter(x => x.status === 2).length})</span></Header>
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
        {/* <form autoComplete="off" style={{ marginTop: 10 }} onSubmit={this.onAddCategory}>
          <Input
            label='Category'
            placeholder='Category Name' value={category}
            onChange={this.handleChange}
            name="category" />
        </form>
        {categories.map(category => <Label
          as="a"
          basic
          color={category.color}
        >
          {category.name}
        </Label>)} */}
        <Table celled>
          <Table.Body>
            {table.filter(x => x.status === searchStatus).sort((x, y) => y.date - x.date).map(({ name, date, status }) => (
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
