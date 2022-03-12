import logLogo from "../images/trunk.png";
import tinderLogo from "../images/tinder.png";

const Nav = ({ minimal, setShowModal, showModal, setIsSignUp }) => {
  const authToken = false;

  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(false);
  };

  return (
    <nav>
      <div className="logo-container">
        <img className="logo" alt="logo" src={minimal ? tinderLogo : logLogo} />
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
