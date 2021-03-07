import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import { ItemList } from './ItemList'
import { SignOut } from './SignOut'
import { useAuthState } from 'react-firebase-hooks/auth'

import { SignIn } from './SignIn'
import { AuthContext } from './AuthContext'

export const ShoppingList: FC = () => {
    const auth = useContext(AuthContext)
    const [user, authLoading] = useAuthState(auth)

    const [name, setName] = useState(user?.displayName)
    const [currency, setCurrency] = useState<string | null>('')

    useEffect(() => {
        if (user) {
            if (user.displayName) {
                setName(user.displayName)
            }
            const currency = localStorage.getItem(`${user.uid}-currency`)
            if (currency) {
                setCurrency(currency)
            }
        }
    }, [user])

    const siginCallback = useCallback((name) => {
        setName(name)
    }, [])

    const signoutCallback = useCallback(() => {
        setName(null)
        setCurrency(null)
    }, [])

    const setCurrencyCallback = useCallback((currency) => {
        setCurrency(currency)
    }, [])

    if (authLoading) {
        return <div>Loading</div>
    }

    return user && name && currency ? (
        <div>
            <span>User: {name}</span>
            {currency && <ItemList currency={currency} />}
            <SignOut onSignOut={signoutCallback} />
        </div>
    ) : (
        <SignIn
            onSignIn={siginCallback}
            onSelectCurrency={setCurrencyCallback}
        />
    )
}
