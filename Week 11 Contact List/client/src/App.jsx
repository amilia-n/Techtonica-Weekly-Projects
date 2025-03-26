// Root component of the application, rendering the Home page
import './App.css';
// import Home from './pages/Home';

function App() {
  return (
    <div>
      {/* <Home /> */}
      [HOME PAGE]
      <div className='home'>
    {/* to render Add Contact Form component, all contacts component (with search), and individual contact component */}
      <div className='main-container'>
        Inside home is main container (phone) <br />
        <div className='display'>
        Will display nav ui on bottom like apps on iphone <br />

        {/* <div className='add-new'>
          Add Contact Form
        </div> */}
        <div className='list-all'>
          <div className='search-list'>
          Search Bar
        </div>
        <div className='contact-list'>
        All Contacts List
        <div className='summary-container'>
          {/* Contact Summary = Header(photo, name) + details (tag, phone number, email) */}
          <div className='summary-header'>
            <div className='summary-img'>Photo</div>
            <div className='summary-name'>Name</div>
          </div>
          <div className='summary-details'>
            Detail
            Tag <br />
            Number <br />
            Email <br />
          </div>
          </div>
          <div className='summary-container'>
          {/* Contact Summary = Header(photo, name) + details (tag, phone number, email) */}
          <div className='summary-header'>
            <div className='summary-img'>Photo</div>
            <div className='summary-name'>Name</div>
          </div>
          <div className='summary-details'>
            Detail
            Tag <br />
            Number <br />
            Email <br />
          </div>
          </div>
          <div className='summary-container'>
          {/* Contact Summary = Header(photo, name) + details (tag, phone number, email) */}
          <div className='summary-header'>
            <div className='summary-img'>Photo</div>
            <div className='summary-name'>Name</div>
          </div>
          <div className='summary-details'>
            Detail
            Tag <br />
            Number <br />
            Email <br />
          </div>
          </div>
        </div>
        </div>
        {/* <div className='individual'>
          Individual Contact List
        </div> */}
        <div className='nav'>
        {/* NAV */}
        <div className='nav-btn'>Btn1</div><div className='nav-btn'>Btn2</div><div className='nav-btn'>Btn3</div>
        </div>
        </div>
        <div className='home-btn'>Home Btn</div>
      </div>
      </div>
      
    </div>
  );
}

export default App;
