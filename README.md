Follow following steps to run this app in your pc:

1. Make sure you have nodejs installed in your pc.
2. Clone this repo.
3. Open Terminal in repo directory. Then type following commands in Terminal.

```
cd backend
npm install
npm start
```

4. The above commands will start the nodejs server at port 8886 by default.(Note: If you just want to see project running then open [http://localhost:8886/](http://localhost:8886/) as build of frontend have also been served from the backend.)
5. If you still want to run react-development server the follow the steps below in a new terminal window:

```
cd frontend
npm install
npm start
```

6. This will start the react development server here [http://localhost:3000/](http://localhost:3000/).
7. If you change the default port of the nodejs backend then make sure to update the path variable in the file _frontend/src/Constants.js_.

_Make sure you do not delete index.html from the virtual environment provided to you when you run this app as that is the entry file. so if you remove that then there will be no output in Preview._
