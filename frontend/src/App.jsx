import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx';
import Signup from './pages/signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LogInfoSkeleton from "./pages/LogInfoSkeleton.jsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/log/:logID' element={<LogInfoSkeleton />} />
      </Routes>
    </Router>
  )
}

export default App;
