## Running
First you need to have [node.js](https://nodejs.org/en/) and [git](https://git-scm.com/) installed locally.

- `git clone https://github.com/mnemon1ck/contacts-manager`
- `cd contacts-manager`
- `npm install`
- `npm run frontend:prod`
- `npm run backend:prod`

After issuing the above commands the backend should start at `http://localhost:8888` (the port can be changed in `cm.config.js`).

## NPM scripts
#### Frontend scripts:
- `npm run frontend:dev` - compile and watch in `dev` mode.
- `npm run frontend:prod` - compile in `prod` mode.
#### Backend scripts:
- `npm run backend:dev` - start the server with [debugging](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27) and watch for changes.
- `npm run backend:prod` - start the server directly without debugging or restarts on change.
#### Common scripts
- `npm run lint` - lint the code with eslint.

## Technology stack
- [React](https://reactjs.org/) - client side framework.
- [Redux](https://redux.js.org/) - state management.
- [WebPack](https://webpack.js.org/) - building of the client code.
- [ReactRouter](https://reacttraining.com/react-router/) - URL management.
- [Axios](https://github.com/axios/axios) - making ajax requests.
- [Babel](https://babeljs.io/) - compilation of the client code.
- [Lodash](https://lodash.com/) - utility for working with collections and objects. 
- [moment.js](https://momentjs.com/) - utility for working with dates.
- [Express](http://expressjs.com/) - server side framework.
- [Sketch](https://www.sketchapp.com/) - the main tool for design.
- [HTTPie](https://httpie.org/) - for making HTTP requests from the terminal.
- [ESLint](https://eslint.org/) - the tool for linting js code. 
- Many other small libraries which don't deserve to be listed here...
