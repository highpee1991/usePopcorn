import { Search } from "../searchAndResult";

export const LogoMenu = ({ query, setQuery, children }) => {
  return (
    <nav className='nav-bar'>
      <Logo />
      <Search query={query} setQuery={setQuery} />
      {children}
    </nav>
  );
};

const Logo = () => {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};
