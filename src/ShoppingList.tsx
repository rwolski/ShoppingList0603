import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import { ItemList } from './ItemList'
import { SignOut } from './SignOut'
import { useAuthState } from 'react-firebase-hooks/auth'

import { SignIn } from './SignIn'
import { AuthContext } from './AuthContext'

export const ShoppingList: FC = () => {
    const auth = useContext(AuthContext)
    const [user] = useAuthState(auth)

    const [name, setName] = useState(user?.displayName)
    const [currency, setCurrency] = useState<string | null>('')

    useEffect(() => {
        if (user) {
            setName(user.displayName)

            const currency = localStorage.getItem(`${user.uid}-currency`)
            if (currency) {
                setCurrency(currency)
            }
        }
    }, [user])

    const siginCallback = useCallback((id, name, currency) => {
        setName(name)
        setCurrency(currency)
    }, [])

    const signoutCallback = useCallback(() => {
        setName(null)
        setCurrency(null)
    }, [])

    return user && name && currency ? (
        <div>
            <span>User: {name}</span>
            {currency && <ItemList currency={currency} />}
            <SignOut onSignOut={signoutCallback} />
        </div>
    ) : (
        <SignIn onSignIn={siginCallback} />
    )
}
