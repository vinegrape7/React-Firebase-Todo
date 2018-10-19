import React, { Component } from "react";
import "./App.css";
import firebase from "firebase";

class App extends Component {
  state = {
    tasks: [],
    taskname: "",
    taskdesc: "",
    selected: {}
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
    var that = this;
    firebase
      .database()
      .ref("/todos")
      // .once("value")
      .on("value", function(snapshot) {
        console.log("Data", snapshot.val());
        let tasks = [];
        for (var key in snapshot.val()) {
          console.log(key);
          console.log(snapshot.val()[key]);
          tasks.push({
            id: key,
            name: snapshot.val()[key].name,
            description: snapshot.val()[key].description
          });
        }
        that.setState({
          tasks: tasks
        });
      });
  }

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
      <div className="App">
        <input
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
        </ul>
      </div>
    );
  }
}

export default App;
