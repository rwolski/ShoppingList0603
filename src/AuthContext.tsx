import React, { FC } from 'react'
import { firebaseApp } from './Firebase'

const auth = firebaseApp.auth()

export const AuthContext = React.createContext(auth)

export const AuthContextProvider: FC<{ value?: any }> = ({
    value,
    children,
}) => (
    <AuthContext.Provider value={value || auth}>
        {children}
    </AuthContext.Provider>
)
