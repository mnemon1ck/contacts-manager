import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import { store } from './redux';

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<App />
		</Router>
	</Provider>,
	// Not rendering in the document.body component because it
	// might introduce conflicts with the browser's extensions.
	document.querySelector('#root')
);
