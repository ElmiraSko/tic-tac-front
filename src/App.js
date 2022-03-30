import './App.css';
import { BrowserRouter as Router,
  Routes, Route} from 'react-router-dom';
  import Main from './components/Main';
import Steps from './components/Steps';
import FileData from './components/FileData';
  

function App() {
  return (
    <Router>
      <header className="header">
        <h2>
            Игра Крестики-Нолики
        </h2>
      </header>
      <div style={{minHeight: "calc(100vh - 120px)"}}>
        <Routes>    
          <Route exact path="/steps"  element={<Steps/>} />
          <Route exact path="/file-data"  element={<FileData/>} />
          <Route exact path="/"  element={<Main/>} />
        </Routes>
      </div>
    <footer>
      <div className="footer">
        {'© '}              
        {new Date().getFullYear()}
        {' TIC-TAC-TOE'}
      </div>
    </footer> 
  </Router>
  );
}

export default App;
