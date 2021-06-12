Follow following steps to run this app in your pc:

1. Make sure you have nodejs installed in your pc.
2. Clone this repo.
3. Open Terminal in repo directory. Then type following commands in Terminal.

```
cd backend
npm install
node app.js
```

4. The above commands will start the nodejs server at port 8886 by default.(Note: If you just want to see project running then open [a link](http://localhost:8886/) as build of frontend have also been served from the backend.)
5. After running server we need to start react development server. So, type following commands in the same Terminal window.

```
cd ../frontend
npm install
npm start
```

6. This will start the react development server on port 3000. Now you can open [a link](http://localhost:3000/) to see the app running.

_Make sure you do not delete index.html from the virtual environment provided to you when you run this app as that is the entry file. so if you remove that then there will be no output in Preview._
