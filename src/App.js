import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Tool from './Tool';
import GitHubButton from 'react-github-button';
require('react-github-button/assets/style.css');

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Alex's Online Tools</h1>
          <GitHubButton type="stargazers" namespace="SuperAL" repo="online-tools" />
        </header>
        <Tool />
      </div>
    );
  }
}

export default App;
