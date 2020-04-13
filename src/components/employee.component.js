import React, { Component } from "react";
import EmployeeDataService from "../services/employee.service";

export default class Employee extends Component {
  constructor(props) {
    super(props);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getEmployee = this.getEmployee.bind(this);
    this.updateOnDuty = this.updateOnDuty.bind(this);
    this.updateEmployee = this.updateEmployee.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);

    this.state = {
      currentEmployee: {
        id: null,
        firstName: "",
        lastName: "",
        description: "",
        onDuty: false
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getEmployee(this.props.match.params.id);
  }

  onChangeFirstName(e) {
    const firstName = e.target.value;

    this.setState(function(prevState) {
      return {
        currentEmployee: {
          ...prevState.currentEmployee,
          firstName: firstName
        }
      };
    });
  }

  onChangeLastName(e) {
    const lastName = e.target.value;

    this.setState(function(prevState) {
      return {
        currentEmployee: {
          ...prevState.currentEmployee,
          lastName: lastName
        }
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;
    
    this.setState(prevState => ({
      currentEmployee: {
        ...prevState.currentEmployee,
        description: description
      }
    }));
  }

  getEmployee(id) {
    EmployeeDataService.get(id)
      .then(response => {
        this.setState({
          currentEmployee: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateOnDuty(status) {
    var data = {
      id: this.state.currentEmployee.id,
      firstName: this.state.currentEmployee.firstName,
      lastName: this.state.currentEmployee.lastName,
      description: this.state.currentEmployee.description,
      onDuty: status
    };

    console.log(data);

    EmployeeDataService.update(this.state.currentEmployee.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentEmployee: {
            ...prevState.currentEmployee,
            onDuty: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateEmployee() {
    EmployeeDataService.update(
      this.state.currentEmployee.id,
      this.state.currentEmployee
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The employee was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteEmployee() {    
    EmployeeDataService.delete(this.state.currentEmployee.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/employees')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentEmployee } = this.state;

    return (
      <div>
        {currentEmployee ? (
          <div className="edit-form">
            <h4>Employee</h4>
            <form>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={currentEmployee.firstName}
                  onChange={this.onChangeFirstName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={currentEmployee.lastName}
                  onChange={this.onChangeLastName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentEmployee.description}
                  onChange={this.onChangeDescription}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentEmployee.onDuty ? "On Duty" : "Off Duty"}
              </div>
            </form>

            {currentEmployee.onDuty ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateOnDuty(false)}
              >
                Set to off duty
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateOnDuty(true)}
              >
                Set to on duty
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteEmployee}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateEmployee}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Employee...</p>
          </div>
        )}
      </div>
    );
  }
}