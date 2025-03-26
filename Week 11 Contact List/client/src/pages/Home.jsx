// Main page component to display components

import "./Home.css";
import Contact from '../components/Contact';
import AddContact from '../components/AddContact';

function Home() {
  return (
    <div className="home">
      <div className="main-container">
        <div className="display">
          <Contact />
          <AddContact />
        </div>
      </div>
    </div>
  );
}

export default Home;
