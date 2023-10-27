//import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from './components/Login.js';
import Dashboard from './components/HomeReact.js';

function App() {
  return (
    <div className="App">
       <BrowserRouter>
       <Routes>
          <Route path="/" element={<Login/>}/>
        {/* <Route path="/home" element={<HomePage/>}/> */}
          <Route path="/home" element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;
