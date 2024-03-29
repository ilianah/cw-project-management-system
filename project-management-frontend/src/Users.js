import React from "react";
import MNavbar from "./MNavbar";
import UserCard from "./UserCard";
import { Row } from "reactstrap";
import Loader from "react-loader";
import Searchbar from "./Searchbar";
import { getUsers, deleteUser } from "./util/requests";

/**
 * Fetches all the users and passes them down to UserCard
 */
export default class Users extends React.Component {
  state = {
    users: [],
    loading: true,
    filter: ""
  };

  // Fetch all users when the component is mounted
  componentDidMount() {
    getUsers(this.props.token).then(res => {
      this.setState({
        users: res,
        loading: false
      });
    });
  }

  // API request to delete user; only performable by an admin
  deleteUser = user => {
    if (this.props.role.includes("Admin")) {
      deleteUser(this.props.token, user.username).then(() => {
        this.setState({
          users: this.state.users.filter(u => u.username !== user.username)
        });
      });
    }
  };

  render() {
    let username = this.props.username;
    let role = this.props.role;
    const users = this.state.users;

    return (
      <React.Fragment>
        <MNavbar
          doLogout={this.props.doLogout}
          role={role}
          username={username}
        />
        <div className="background" />

        <Searchbar
          value={this.state.filter}
          onChange={this.onFilterChange}
          placeholder="Search by name/skills"
        />

        <div>
          {this.state.loading && <Loader loaded={!this.state.loading} />}

          {!this.state.loading && (
            <Row>
              {users
                .filter(
                  u =>
                    u.name
                      .toLowerCase()
                      .includes(this.state.filter.toLowerCase()) ||
                    (typeof u.skills === "string" &&
                      u.skills
                        .toLowerCase()
                        .includes(this.state.filter.toLowerCase()))
                )
                .filter(u => u.username !== username)
                .map(u => (
                  <UserCard
                    user={u}
                    key={u.username}
                    role={role}
                    deleteUser={e => this.deleteUser(u)}
                    token={this.props.token}
                    filter={this.state.filter ? this.state.filter : null}
                  />
                ))}
            </Row>
          )}
        </div>
      </React.Fragment>
    );
  }

  // Handle search
  onFilterChange = e => {
    this.setState({ filter: e.target.value.replace(/[^a-zA-Z0-9]/, "") });
  };
}
