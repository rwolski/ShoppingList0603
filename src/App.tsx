import React from 'react'
import './App.css'

import { ShoppingList } from './ShoppingList'
import { AuthContextProvider } from './AuthContext'

const App = () => (
    <AuthContextProvider>
        <header>
            <h1>Shopping List</h1>
        </header>
        <section>
            <ShoppingList />
        </section>
    </AuthContextProvider>
)

export default App
