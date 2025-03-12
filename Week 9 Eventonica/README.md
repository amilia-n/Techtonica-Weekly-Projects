Week 9 Event Management App

Frontend
* Navbar:
  Eventonica
  -------
  Hello {User}!
  -------
  Tab 1 => Home
  Tab 2 => Manage Events
  Tab 3 => Manage Participants

*	Events should have:
- Name, Date, Description, Category, pin + edit button
*	Edit Event should have: 
•	Change name
•	Change date/time
•	Change description
•	Change category
•	Edit participant (add, delete, change)
*	NEED TO BE ABLE TO:
o	Add Event + Participant
-	React: add component
-	Express: POST
-	Postgres: Add to table
o	Delete Event + Participant
-	React: delete component
-	Express: DELETE
-	Postgres: Remove from table
o	Edit Event + Participant
-	React: edit component 
-	Express: PUT
-	Postgres: Update a table
o	Favorite(pin)/unpin Event 
-	React: favorite component (callback)
-	Express: POST
-	Postgres: Add to table
o	Search Event (Filter by name + description)
Filter event by date
Filter event by category
-	SORT/FILTER events: .filter().map()




Backend DB:
Favorite | Event Name | Date and Time| Description | Participant
