// Form component for adding new contact

import "./AddContact.css";

function AddContact() {
  return (
    <div className="add-new">
      <div className="form-header">
        <div>Cancle Btn</div>
        <div>New Contact</div>
        <button type="submit">Done</button>
      </div>
      <div className="add-img">IMG</div>
      <div className="add-btn">Add Photo Btn</div>
      <div className="add-detail-container">
        <div>FistName</div>
        <div>LastName</div>
        <div>+ Btn to add new #</div>
        <div>+ Btn to add new email</div>
        <div>+ Btn to add new tags</div>
        <div>Notes form</div>
      </div>
    </div>
  );
}

export default AddContact;
