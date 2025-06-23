import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import './App.css'
import LoginPage from './login/LoginPage'
import Dashboard from './dashboard/pages/Dashboard';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
