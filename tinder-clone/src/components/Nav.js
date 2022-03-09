import logLogo from "../images/trunk.png";
import tinderLogo from "../images/tinder.png";

const Nav = ({ minimal, authToken, setShowModal, showModal, setIsSignUp }) => {
  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(false);
  };

  return (
    <nav>
      <div className="logo-container">
        <img className="logo" alt="logo" src={minimal ? logLogo : tinderLogo} />
      </div>

      {!authToken && !minimal && (
        <button className="nav-button" onClick={handleClick} disabled={showModal}>
          Log In
        </button>
      )}
    </nav>
  );
};

export default Nav;
