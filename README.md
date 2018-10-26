# locallibrary
mdn local library tutorial with own modifications. Tutorial can be found here: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Tutorial_local_library_website

In order to use this app:
1. Copy or clone this repository to where you want.
2. Go to command line (you need to be in the folder where you copied this repository) and run npm install. This is needed in order to install needed packages to run the app.
3. There are many ways to run the app. This is done from commandline. I list each one and what they do:
  
      3.1 npm start  (this command runs the app without any debugging).
  
      3.2 npm run debugstart  (runs the app with debugging. debugging appears on commandline).
  
      3.3 npm run devstart  (runs the app with automatically restarting of server upon file change. Useful when coding. Otherwise not needed).
  
      3.4 npm run devdebugstart  (runs the app with automatically restarting of server upon file change with debugging. debugging appears on commandline. Useful when coding. Otherwise not needed).

After starting the app. Write localhost:3000 on your preferred browser's address bar.

api can be found once app is running by going to: localhost:3000/catalog/api   (shows counts of everything on the app).

other possible api queries:
1. localhost:3000/catalog/api/kirjat (shows all books).
2. localhost:3000/catalog/api/kirjailijat (shows all authors).
3. localhost:3000/catalog/api/kirjainstanssit (shows all bookinstances aka copies of books).
4. localhost:3000/catalog/api/luokat (shows all genres).
