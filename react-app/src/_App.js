import React from 'react';
import logo from './logo.svg';
import './App.css';

import $ from 'jquery';
import axios from 'axios'

/**
 * 
 */
class App extends React.Component
{
    /**
     * 
     */
    constructor( props ) {
        super( props );

        //internal bindings
        this.state = {
            isLoggedIn: false,
            user: {}
        };
    }

    /**
     * 
     */
    componentDidMount() 
    {
        let state = localStorage["appState"];
        if (state) {
            let AppState = JSON.parse(state);
            console.log(AppState);
            this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState });
        }
    }

    /**
     * 
     */
    render()
    {
        return (
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload teste.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </header>
            </div>
          );
    }

    _logoutUser = () => {
        let appState = {
          isLoggedIn: false,
          user: {}
        };
        // save app state with user date in local storage
        localStorage["appState"] = JSON.stringify(appState);
        this.setState(appState);
      };

    _registerUser = (name, email, password) => {
        $("#email-login-btn")
          .attr("disabled", "disabled")
          .html(
            '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i><span class="sr-only">Loading...</span>'
          );
    
        var formData = new FormData(); 
        formData.append("password", password);
        formData.append("email", email);
        formData.append("name", name);
    
        axios
          .post("http://localhost:8000/api/user/register", formData)
          .then(response => {
            console.log(response);
            return response;
          })
          .then(json => {
            if (json.data.success) {
              alert(`Registration Successful!`);
    
              let userData = {
                name: json.data.data.name,
                id: json.data.data.id,
                email: json.data.data.email,
                auth_token: json.data.data.auth_token,
                timestamp: new Date().toString()
              };
              let appState = {
                isLoggedIn: true,
                user: userData
              };
              // save app state with user date in local storage
              localStorage["appState"] = JSON.stringify(appState);
              this.setState({
                isLoggedIn: appState.isLoggedIn,
                user: appState.user
              });
            } else {
              alert(`Registration Failed!`);
              $("#email-login-btn")
                .removeAttr("disabled")
                .html("Register");
            }
          })
          .catch(error => {
            alert("An Error Occured!" + error);
            console.log(`${formData} ${error}`);
            $("#email-login-btn")
              .removeAttr("disabled")
              .html("Register");
          });
      };

    _loginUser (email, password) {
        $("#login-form button")
          .attr("disabled", "disabled")
          .html(
            '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i><span class="sr-only">Loading...</span>'
          );
        var formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
    
        axios
          .post("http://localhost:8000/api/user/login/", formData)
          .then(response => {
            console.log(response);
            return response;
          })
          .then(json => {
            if (json.data.success) {
              alert("Login Successful!");
    
              let userData = {
                name: json.data.data.name,
                id: json.data.data.id,
                email: json.data.data.email,
                auth_token: json.data.data.auth_token,
                timestamp: new Date().toString()
              };
              let appState = {
                isLoggedIn: true,
                user: userData
              };
              // save app state with user date in local storage
              localStorage["appState"] = JSON.stringify(appState);
              this.setState({
                isLoggedIn: appState.isLoggedIn,
                user: appState.user
              });
            } else alert("Login Failed!");
    
            $("#login-form button")
              .removeAttr("disabled")
              .html("Login");
          })
          .catch(error => {
            alert(`An Error Occured! ${error}`);
            $("#login-form button")
              .removeAttr("disabled")
              .html("Login");
          });
      };
}

export default App;
