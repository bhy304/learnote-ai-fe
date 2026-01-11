import { Navigate, Route, Routes } from 'react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/SignUp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
