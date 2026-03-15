import { Link } from 'react-router-dom';

export const Header = () =>{
  return (
    <header className="app-header">
      <div className="logo-group">
        <Link to="/dashboard">
          <img className="logo-img" src="logo512.png" alt="Logo" />
        </Link>
      </div>
      <div className="header-text">
        <h3>Looking for awesome T-shirts?</h3>
        <a className="site-link" href="https://radstore.pk/collections/t-shirts" target="_blank" rel="noreferrer">Buy Now</a>
      </div>
    </header>
  )
}