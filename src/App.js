import React, { Component } from "react";
import {
  Container,
  Dropdown,
  Image,
  List,
  Menu,
  Segment
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
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item as="a" header>
              <Image size="mini" src={logo} style={{ marginRight: "1.5em" }} />
              RTM
            </Menu.Item>
            <Menu.Item
              as="a"
              onClick={() => this.onPageChange("tasks")}
              disabled={page === "tasks"}
            >
              Tasks
            </Menu.Item>
            <Menu.Item
              as="a"
              onClick={() => this.onPageChange("notes")}
              disabled={page === "notes"}
            >
              Notes
            </Menu.Item>

            <Dropdown item simple text="Dropdown">
              <Dropdown.Menu>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Header Item</Dropdown.Header>
                <Dropdown.Item>
                  <i className="dropdown icon" />
                  <span className="text">Submenu</span>
                  <Dropdown.Menu>
                    <Dropdown.Item>List Item</Dropdown.Item>
                    <Dropdown.Item>List Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Container>
        </Menu>

        <Container
          className="Site-content"
          text
          style={{ marginTop: "7em", flex: 1 }}
        >
          <div>{page === "tasks" ? <Tasks /> : <Notes />}</div>
        </Container>

        <Segment
          inverted
          vertical
          style={{ margin: "5em 0em 0em", backgroundColor: "black" }}
        >
          <Container textAlign="center">
            <List horizontal inverted divided link size="small">
              <List.Item as="a" href="#">
                Site Map
              </List.Item>
              <List.Item as="a" href="#">
                Contact Us
              </List.Item>
              <List.Item as="a" href="#">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="#">
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    );
  }
}
