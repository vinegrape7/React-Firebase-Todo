import React, { Component } from "react";
import "./App.css";
import firebase from "firebase";
import Login from "./components/Login";
import { BrowserRouter, Route } from "react-router-dom";
import Chat from "./components/Chat";
import User from "./components/User";

class App extends Component {
  state = {
    tasks: [],
    taskname: "",
    taskdesc: "",
    selected: {},
    user: null,
    messages: [],
    messagesLoaded: false
  };
  componentWillMount() {
    var config = {
      apiKey: "AIzaSyCl3EOOO3BwOomeCfuutnWFBNh9NyPOoDU",
      authDomain: "todo-2e3d7.firebaseapp.com",
      databaseURL: "https://todo-2e3d7.firebaseio.com",
      projectId: "todo-2e3d7",
      storageBucket: "todo-2e3d7.appspot.com",
      messagingSenderId: "596384793443"
    };
    firebase.initializeApp(config);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.props.history.push("/login");
      }
    });

    firebase
      .database()
      .ref("/messages")
      .on("value", snapshot => {
        this.onMessage(snapshot);
        if (!this.state.messagesLoaded) {
          this.setState({ messagesLoaded: true });
        }
      });

    // var that = this;
    // firebase
    //   .database()
    //   .ref("/todos")
    //   // .once("value")
    //   .on("value", function(snapshot) {
    //     console.log("Data", snapshot.val());
    //     let tasks = [];
    //     for (var key in snapshot.val()) {
    //       console.log(key);
    //       console.log(snapshot.val()[key]);
    //       tasks.push({
    //         id: key,
    //         name: snapshot.val()[key].name,
    //         description: snapshot.val()[key].description
    //       });
    //     }
    //     that.setState({
    //       tasks: tasks
    //     });
    //   });
  }

  onMessage = snapshot => {
    console.log("snapshot", snapshot);
    console.log("snapshot val", snapshot.val());
    if (snapshot.val() !== null) {
      const messages = Object.keys(snapshot.val()).map(key => {
        const msg = snapshot.val()[key];
        console.log(msg);
        msg.id = key;
        return msg;
      });
      this.setState({ messages });
    }
  };

  addTask = () => {
    const obj = {
      name: this.state.taskname,
      description: "this is task description"
    };
    firebase
      .database()
      .ref("/todos")
      .push(obj, function() {
        console.log("added");
      });
  };

  handleSubmitMessage = msg => {
    const data = {
      msg,
      author: this.state.user.email,
      user_id: this.state.user.uid,
      timestamp: Date.now()
    };
    firebase
      .database()
      .ref("messages/")
      .push(data);
  };

  taskClicked = task => {
    const key = task.id;
    let updatetaskObj = {
      [key]: {
        name: task.name + "updated",
        description: task.description
      }
    };
    console.log(updatetaskObj);
    firebase
      .database()
      .ref("todos/")
      .update(updatetaskObj, function() {
        console.log("added");
      });
  };

  render() {
    return (
      <BrowserRouter>
        <div id="container">
          <Route path="/login" component={Login} />
          <Route
            exact
            path="/"
            render={() => (
              <Chat
                messagesLoaded={this.state.messagesLoaded}
                onSubmit={this.handleSubmitMessage}
                user={this.state.user}
                messages={this.state.messages}
              />
            )}
          />
          <Route
            path="/users/:id"
            component={User}
            render={({ history, match }) => (
              <User
                messages={this.state.messages}
                messagesLoaded={this.state.messagesLoaded}
                userID={match.params.id}
              />
            )}
          />
          {/* <input
          type="text"
          value={this.state.taskname}
          onChange={e => {
            console.log(e);
            this.setState({
              taskname: e.target.value
            });
          }}
        />
        <button onClick={this.addTask}>Add Task</button>
        <h2>Tasks</h2>
        <ul>
          {this.state.tasks &&
            this.state.tasks.map(d => {
              return (
                <li onClick={() => this.taskClicked(d)}>
                  {d.name}- {d.description}
                </li>
              );
            })}
        </ul> */}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
