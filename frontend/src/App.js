//import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from './components/Login.js';
import HomePage from './components/Home.js';
import Layout from './components/Home-react.js';

function App() {
  return (
    <div className="App">
       <BrowserRouter>
       <Routes>
          <Route path="/" element={<Login/>}/>
        {/* <Route path="/home" element={<HomePage/>}/> */}
          <Route path="/home" element={<Layout/>}/>
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;
