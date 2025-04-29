import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import App from './App.jsx'
import store from './store/store.js'
import {Provider} from 'react-redux'
import './index.css'

createRoot(document.getElementsByClassName('container')[0]).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
)
