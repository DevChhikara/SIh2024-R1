1. After downloading/cloning the repo on your system go to each directory client and server after going into each directory make a .env final in each directorty. <br />
git clone https://github.com/DevChhikara/SIh2024-R1 
3. First lets say you are Client make a .env with template: <br />
<br />
  NODE_ENV=local<br />
<br />
(Further if you want to use your local system backend also go to src/services/config.ts and change the backend url to your localhost erver port).<br />
4. Then use command ( npm i && npm run dev ) in the same directory to start the frontend server. <br />
5. After that go in the server directory similarly create a .env file and fill your details according to the given template below: <br />
 <br />
  PORT=8000<br />
  NODE_ENV=local<br />
  MONGO_URI= // fill your MONGO URL here<br />
  JWT_SECRET= // create your secret key here<br />
  JWT_EXPIRE=3h<br />
<br />
6. After making the .env file use the command ( npm i && npm run dev) to start the server on your local system.<br />
7. Visit the frontend by following the link on client directory terminal. <br />
Also make sure you have both the client and server running before opening the frontend in different terminals. <br />

For any query regarding setup and working contanct: Dm any of the team members.<br />


