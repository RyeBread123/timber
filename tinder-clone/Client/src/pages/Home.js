import Nav from "../components/Nav";
import { useState } from "react";
import AuthModal from "../components/AuthModal";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const authToken = false;

  const handleClick = () => {
    console.log("Clicked!");
    setShowModal(true);
    setIsSignUp(true);
  };

  return (
    <div className="overlay">
      <Nav
        minimal={false}
        showModal={showModal}
        setShowModal={setShowModal}
        setIsSignUp={setIsSignUp}
      />
      <div className="home">
        <h1 className="primary-title">Swipe Right®</h1>
        <button className={"primary-button"} onClick={handleClick}>
          {authToken ? "Signout" : "Create Account"}
        </button>
        {showModal && (
          <AuthModal
            isSignUp={isSignUp}
            setShowModal={setShowModal}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
