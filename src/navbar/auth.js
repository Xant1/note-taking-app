import { Routes, useNavigate, Route, Link } from 'react-router-dom';
import Dashboard from '../components/dashboard';

function Auth() {
  const navigate = useNavigate();

  const logoutUser = () => {
    localStorage.clear();
    navigate('/');
  };
  
  return (
    <>
      <nav className='navbar navbar-expand-sm navbar-dark bg-dark d-flex '>
        <ul className='navbar-nav '>
          <li className='nav-item'>
            <Link className='nav-link' to='/'>
              Dashboard
            </Link>
          </li>
          <li className='nav-item '>
            <span role='button' className='nav-link ' onClick={logoutUser}>
              Logout
            </span>
          </li>
        </ul>
      </nav>
      <div className='container'>
        <Routes>
          <Route path='/' element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}

export default Auth;
