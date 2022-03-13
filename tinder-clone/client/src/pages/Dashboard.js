import { useState, useEffect } from "react";
import TinderCard from 'react-tinder-card'
import ChatContainer from '../components/ChatContainer'
import axios from 'axios'
import { useCookies } from 'react-cookie'

const Dashboard = () => {
  const [cookies,setCookie,removeCookie] = useCookies(['user'])
  const [lastDirection, setLastDirection] = useState();
  const [user, setUser] = useState(null);

const userId = cookies.UserId

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user', {
        params: {userId}
      })
      setUser(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  console.log('USER', user)


  const characters = [
    {
      name: "Richard Hendricks",
      url: "https://imgur.com/Uzc3s4j.jpg",
    },
    {
      name: "Erlich Bachman",
      url: "https://imgur.com/7MvY81t.jpg",
    },
    {
      name: "Monica Hall",
      url: "https://imgur.com/Fcy1vIF.jpg",
    },
    {
      name: "Jared Dunn",
      url: "https://imgur.com/tfilOFL.jpg",
    },
    {
      name: "Dinesh Chugtai",
      url: "https://imgur.com/3uUwLHc.jpg",
    },
  ];

  const swiped = (direction, nameToDelete) => {
    console.log("removing: " + nameToDelete);
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  return (
    <>
    { user &&
    <div className="dashboard">
      <ChatContainer user={user}/>
      <div className="swipe-container">
        <div className="card-container">
          {characters.map((character) =>
            <TinderCard
              className="swipe"
              key={character.name}
              onSwipe={(dir) => swiped(dir, character.name)}
              onCardLeftScreen={() => outOfFrame(character.name)}
            >
              <div
                style={{ backgroundImage: "url(" + character.url + ")" }}
                className="card"
              >
                <h3>{character.name}</h3>
              </div>
            </TinderCard>
          )}
          <div className="swipe-info">
            {lastDirection ? <p>You Swiped {lastDirection} </p> : <p/>}
          </div>
        </div>
      </div>
    </div>}
    </>
  );
};

export default Dashboard;
