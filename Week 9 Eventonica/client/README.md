Minimum Requirements:
Be able to show, add, and delete. This will allow you to practice Get, Post, and Delete requests, React forms, react useReducer hook, and working with SQL tables and queries. 
Search for events by category, event name, or date.
STRETCH GOAL: Be able to favorite and unfavorite events. This will allow you to practice Put requests. *Bonus task - go back and use a Put request so you can edit events beyond favoriting. 
 At least 15 commits and 1 PR. This is a large project that will take all week. You might not finish, and that’s okay. 15 commits for this project should be considered a bare minimum. 
Every time you make a change to your code and the code is working, go ahead and commit.  
It’s a good idea to push your code at the end of every work day. Make sure those changes are saved to GitHub in case something happens to the local copy on your machine.
Have a README. Your README should have clear instructions for how someone could run your app from start to finish on their local machine. Include any unit or API tests and how to run them in the README. Here’s a template to give you an idea how to proceed. 
Have CSS to customize the look. You don’t have to go all out on the design of the project, but you should implement some CSS techniques that you’ve learned so that you are practicing the skill. 
Use the useReducer hook. There is another hook called useReducer which is better for more complex state management. Read this article about the reducer concept. 
There are 3 main parts of a reducer: Store, or state: the information you want to store and update. Yours will have all of the event fields. Actions: how state is updated For a state like [users, setUsers] = React.useState([]), setUsers is the only function that can mutate users. Similarly, the dispatch function can "send" specific actions, which are the only way to update the state. Actions typically have a type and a payload.
Reducer A function that accepts the current state and action. It returns the new state.
Postgres Database. Previously, your data was stored in memory in Express, so it would disappear if the application restarted. For production applications, data must be stored in a more permanent way. Move your data to a Postgres database and connect to that database in your Express APIs. You can modify the initial database provided with the template in any way you please.
Sort/ filter events using .filter().map
