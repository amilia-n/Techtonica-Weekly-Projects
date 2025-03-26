// Root component of the application, rendering the Home page
import './App.css';
// import Home from './pages/Home';

function App() {
  return (
    <div>
      {/* <Home /> */}
      [HOME PAGE]
      <div className='home'>
      <div className='main-container'>
        {/* Inside home is main container (phone) <br /> */}
        <div className='display'>
        {/* list all */}
        <div className='list-all'>
          <div className='header'>
            <div className='search'>Search</div>
            <div className='add'>+ Btn</div>
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
        {/* Add New Form*/}
        <div className='add-new'> 
        <div className='form-header'>
          <div>Cancle Btn</div>
          <div>New Contact</div>
          <div>Done Btn</div>
        </div>
        </div> 
        {/* Individual Contact Card*/}
        <div className='individual'> </div> 

        </div>
      </div>
      </div>
      
    </div>
  );
}

export default App;
