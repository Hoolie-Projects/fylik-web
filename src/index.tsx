import React from 'react';
import ReactDOM from 'react-dom';

import App from './App'

import { Provider as StorageProvider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { persistor, store } from "./store"

import { RouterProvider } from 'react-router5'
import router from './router';

import "./styles/main.sass"

router.start(() => {
  ReactDOM.render(
    <StorageProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </PersistGate>
    </StorageProvider>,
    document.getElementById('root')
  )
})
