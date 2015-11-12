# Overview
Fantasy football web application, initially targeted at PAC-12 NCAAF.

# Technologies
* Flask
* Lodash
* React
* Redux/React-Redux
* Socket.io
* Webpack

# Resources
* https://flask-socketio.readthedocs.org/en/latest/

# Server Development Setup
Create a [Python Virtual Environment](https://virtualenv.readthedocs.org/en/latest/)
```
cd server/
virtualenv venv
```

Activate the Virtual Environment and Install Requirements
```
source venv/bin/activate
pip install -r requirements.txt
```

Build the Develment Database
```
python manage.py db_rebuild
```

Launch the Python Shell with Database Context (i.e., Models with Fake Data)
```
python manage.py shell
```

# Working on the client
While working on the client, it is helpful to view the page and get canned responses from the server. In order to set up a simple dev server and view your progress, follow these instructions (requires node and npm installed on your machine, http://blog.teamtreehouse.com/install-node-js-npm-mac):

```
cd client
npm install
npm start
```
Navigate to http://localhost:4000. Note that any changes to the js app code will be picked up if you refresh the page in your browser. Any changes to devServer.js will require a server restart.
