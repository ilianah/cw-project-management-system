import React from 'react';
import { Navbar, NavItem, NavLink, UncontrolledDropdown, DropdownItem, DropdownToggle, DropdownMenu, Nav, Collapse, NavbarToggler } from 'reactstrap';

class AppNavbar extends React.Component {
    state = { isOpen: false };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {
        const { doLogout, role, username } = this.props;
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink href="/projects">Projects</NavLink>
                            </NavItem>
                            {role && role.includes('Admin') &&
                                <NavItem>
                                    <NavLink href="/users">Users</NavLink>
                                </NavItem>
                            }
                        </Nav>
                    </Collapse>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav navbar className="m-auto">
                            <form className="form-inline">
                                <input className="form-control mr-sm-2" type="search" placeholder="Search Project/User..." aria-label="Search" />
                                <button className="btn btn-outline-secondary my-2 my-sm-0" type="submit">Search</button>
                            </form>
                        </Nav>
                    </Collapse>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    {username}
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem href={`/ ${username}`}>My Profile</DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>
                                        <NavLink onClick={doLogout}>Logout</NavLink>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
};

export default AppNavbar;