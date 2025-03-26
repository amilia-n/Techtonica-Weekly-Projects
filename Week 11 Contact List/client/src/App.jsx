// Root component of the application, rendering the Home page
import "./App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// import Home from './pages/Home';

function App() {
  return (
    <div>
      {/* <Home /> */}
      [HOME PAGE]
      <div className="home">
        <div className="main-container">
          {/* Inside home is main container (phone) <br /> */}
          <div className="display">
            {/* list all */}
            <div className="list-all">
              <div className="header">
                <div className="search">
                {/* <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" style={{color: "#acadaf",}} /> */}
                  Search
                  {/* allow search by name + by tags */}
                </div>
                <div className="add">
                {/* <FontAwesomeIcon icon="fa-solid fa-user-plus" style={{color: "#442c2e",}} /> */}
                </div>
              </div>
              <div className="contact-list">
                All Contacts List
                <div className="summary-container">
                  {/* Contact Summary = Header(photo, name) + details (tag, phone number, email) */}
                  <div className="summary-header">
                    <div className="summary-img">Photo</div>
                    <div className="summary-name">Name</div>
                  </div>
                  <div className="summary-details">
                  <div className="tags">
                  <div className="tagFriend">Friend</div>
                  <div className="tagWork">Work</div>
                  <div className="tagFamily">Family</div>
                  <div className="tagNetworking">Networking</div>
                  <div className="tagOther">Other</div>
                </div>
                    Number <br />
                    Email <br />
                  </div>
                </div>
                <div className="summary-container">
                  {/* Contact Summary = Header(photo, name) + details (tag, phone number, email) */}
                  <div className="summary-header">
                    <div className="summary-img">Photo</div>
                    <div className="summary-name">Name</div>
                  </div>
                  <div className="summary-details">
                  <div className="tags">
                  <div className="tagFriend">Friend</div>
                  <div className="tagWork">Work</div>
                  <div className="tagFamily">Family</div>
                  <div className="tagNetworking">Networking</div>
                  <div className="tagOther">Other</div>
                </div>
                    Number <br />
                    Email <br />
                  </div>
                </div>
                <div className="summary-container">
                  {/* Contact Summary = Header(photo, name) + details (tag, phone number, email) */}
                  <div className="summary-header">
                    <div className="summary-img">Photo</div>
                    <div className="summary-name">Name</div>
                  </div>
                  <div className="summary-details">
                  <div className="tags">
                  <div className="tagFriend">Friend</div>
                  <div className="tagWork">Work</div>
                  <div className="tagFamily">Family</div>
                  <div className="tagNetworking">Networking</div>
                  <div className="tagOther">Other</div>
                </div>
                    Number <br />
                    Email <br />
                  </div>
                </div>
              </div>
            </div>
            {/* Add New Form*/}
            <div className="add-new">
              <div className="form-header">
                <div>Cancle Btn</div>
                <div>New Contact</div>
                <button type="submit">Done</button>
              </div>
              <div className="add-img">IMG</div>
              {/* <FontAwesomeIcon icon="fa-regular fa-image" style={{color: "#cfcfcf",}} /> */}
              {/* <label className="file-upload">
              <img src={addIcon} alt="Upload" />
              <span>Upload Image</span>
              <input type="file" name="image" accept="image/*" />
            </label> */}
              <div className="add-btn">Add Photo Btn</div>
              <div className="add-detail-container">
                {/* Form for First name, last name, phone, email, notes, assign tags + */}
                <div>FistName</div>
                <div>LastName</div>
                <div>+ Btn to add new #</div>
                <div>+ Btn to add new email</div>
                <div>+ Btn to add new tags</div>
                <div>Notes form</div>
              </div>
            </div>
            {/* Individual Contact Card*/}
            <div className="individual">
              <div className="individual-header">
                {/* Header: Back to list + edit btn */}
                <div className="return-to-list">
                {/* <FontAwesomeIcon icon="fa-regular fa-address-card" style={{color: "#442c2e",}} /> */}
                  Return to List
                  </div>
                <div className="change-detail">
                {/* <FontAwesomeIcon icon="fa-regular fa-pen-to-square" style={{color: "#442c2e",}} /> */}
                  Edit
                  </div>
              </div>
              <div className="contact-img">IMG</div>
              <div className="contact-name">NAME</div>
              {/* Detail Container = display tags */}
              <div className="contact-detail">
                <div className="tags">
                  <div className="tagFriend">Friend</div>
                  <div className="tagWork">Work</div>
                  <div className="tagFamily">Family</div>
                  <div className="tagNetworking">Networking</div>
                  <div className="tagOther">Other</div>
                </div>
                <div className="detail-list">
                  <div>Phone Number: </div>
                  <div>Email: </div>
                  <div>Notes: </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
