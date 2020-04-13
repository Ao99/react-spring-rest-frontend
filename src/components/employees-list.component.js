import React, { Component } from "react";
import EmployeeDataService from "../services/employee.service";
import { Link } from "react-router-dom";

export default class EmployeesList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchLastName = this.onChangeSearchLastName.bind(this);
    this.retrieveEmployees = this.retrieveEmployees.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveEmployee = this.setActiveEmployee.bind(this);
    this.removeAllEmployees = this.removeAllEmployees.bind(this);
    this.searchLastName = this.searchLastName.bind(this);

    this.state = {
      employees: [],
      currentEmployee: null,
      currentIndex: -1,
      searchLastName: ""
    };
  }

  componentDidMount() {
    this.retrieveEmployees();
  }

  onChangeSearchLastName(e) {
    const searchLastName = e.target.value;

    this.setState({
      searchLastName: searchLastName
    });
  }

  retrieveEmployees() {
    EmployeeDataService.getAll()
      .then(response => {
        this.setState({
          employees: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveEmployees();
    this.setState({
      currentEmployee: null,
      currentIndex: -1
    });
  }

  setActiveEmployee(employee, index) {
    this.setState({
      currentEmployee: employee,
      currentIndex: index
    });
  }

  removeAllEmployees() {
    EmployeeDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchLastName() {
    EmployeeDataService.findByLastName(this.state.searchLastName)
      .then(response => {
        this.setState({
          employees: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchLastName, employees, currentEmployee, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by lastName"
              value={searchLastName}
              onChange={this.onChangeSearchLastName}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchLastName}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Employees List</h4>

          <ul className="list-group">
            {employees &&
              employees.map((employee, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveEmployee(employee, index)}
                  key={index}
                >
                  {employee.firstName}
                  &nbsp;
                  {employee.lastName}
                </li>
              ))}
          </ul>

          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllEmployees}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentEmployee ? (
            <div>
              <h4>Employee</h4>
              <div>
                <label>
                  <strong>First Name:</strong>
                </label>{" "}
                {currentEmployee.firstName}
              </div>
              <div>
                <label>
                  <strong>Last Name:</strong>
                </label>{" "}
                {currentEmployee.lastName}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentEmployee.description}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentEmployee.onDuty ? "On Duty" : "Off Duty"}
              </div>

              <Link
                to={"/employees/" + currentEmployee.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Employee...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}