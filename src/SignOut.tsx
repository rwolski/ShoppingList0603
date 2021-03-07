import { FC, useCallback, useContext } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { AuthContext } from './AuthContext'

interface SignOutProps {
    onSignOut?: () => void
}

export const SignOut: FC<SignOutProps> = ({ onSignOut }) => {
    const auth = useContext(AuthContext)
    const [user] = useAuthState(auth)
    const onClickHandler = useCallback(() => {
        if (user) {
            localStorage.removeItem(`${user.uid}-currency`)
            auth.signOut()
        }
        onSignOut?.()
    }, [auth, onSignOut, user])

    return (
        auth.currentUser && (
            <button className="sign-out" onClick={onClickHandler}>
                Leave
            </button>
        )
    )
}
