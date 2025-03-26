// Component for displaying contact
import "./Contact.css";

function Contact() {
  return (
    <>
      <div className="list-all">
        <div className="header">
          <div className="search">
            Search
          </div>
          <div className="add">
          </div>
        </div>
        <div className="contact-list">
          All Contacts List
          <div className="summary-container">
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

      <div className="individual">
        <div className="individual-header">
          <div className="return-to-list">
            Return to List
          </div>
          <div className="change-detail">
            Edit
          </div>
        </div>
        <div className="contact-img">IMG</div>
        <div className="contact-name">NAME</div>
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
    </>
  );
}

export default Contact;
