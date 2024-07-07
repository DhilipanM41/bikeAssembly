import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginComponent from './component/loginComponent';
import EmployeeComponent from './component/employeeComponent';
import AdminComponent from './component/adminComponent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginComponent />}></Route>
        <Route path='/admin' element={<AdminComponent />}></Route>
        <Route path='/home' element={<EmployeeComponent />}></Route>
      </Routes>
    </BrowserRouter>
  ); 
}

export default App;
