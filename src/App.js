import React, { Component } from "react";
import {
  Container,
  Image,
  Menu
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import logo from "./logo.svg";
import "./index.css";
import Tasks from "./components/Tasks";
import Notes from "./components/Notes";

export default class App extends Component {
  state = {
    page: "tasks"
  };
  onPageChange = page => {
    this.setState({ page });
  };
  render() {
    const { page } = this.state;
    return (
      <div className="Site">
        <title>React Todo Manager</title>
        <Menu color={'teal'} fixed="top" inverted>
          <Container>
            <Menu.Item as="a" header>
              <Image size="mini" src={logo} style={{ marginRight: "1.5em" }} />
              React Todo Manager
            </Menu.Item>
            <Menu.Item
              as="a"
              onClick={() => this.onPageChange("tasks")}
            >
              Tasks
            </Menu.Item>
            <Menu.Item
              as="a"
              onClick={() => this.onPageChange("notes")}
            >
              Notes
            </Menu.Item>
          </Container>
        </Menu>

        <Container
          className="Site-content"
          text
          style={{ marginTop: "7em", flex: 1 }}
        >
          <div>{page === "tasks" ? <Tasks /> : <Notes />}</div>
        </Container>
      </div>
    );
  }
}
