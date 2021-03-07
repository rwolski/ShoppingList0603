import { FC, useCallback, useState, useContext } from 'react'
import { AuthContext } from './AuthContext'
import firebase from 'firebase/app'
import { currencies } from './Currency'
import { useAuthState } from 'react-firebase-hooks/auth'

interface SignInProps {
    onSignIn: (name: string) => void
    onSelectCurrency: (currency: string) => void
}

export const SignIn: FC<SignInProps> = ({ onSignIn, onSelectCurrency }) => {
    const auth = useContext(AuthContext)
    const [user] = useAuthState(auth)
    const [name, setName] = useState('')
    const [currency, setCurrency] = useState('')
    const [loading, setLoading] = useState(false)

    const onClickAnonymousHandler = useCallback(() => {
        setLoading(true)
        auth.signInAnonymously().then((credentials) => {
            setLoading(false)
            if (credentials.user) {
                credentials.user.updateProfile({ displayName: name })
                onSignIn?.(name)
            }
        })
    }, [auth, name, onSignIn])

    const onClickGoogleHandler = useCallback(() => {
        setLoading(true)
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider).then((credentials) => {
            setLoading(false)
            if (credentials.user) {
                onSignIn?.(credentials.user.displayName || credentials.user.uid)
            }
        })
    }, [auth, onSignIn])

    const onClickContinue = useCallback(() => {
        if (user) {
            onSelectCurrency?.(currency)
            localStorage.setItem(`${user.uid}-currency`, currency)
        }
    }, [currency, onSelectCurrency, user])

    if (loading) {
        return <div>Loading</div>
    }

    return (
        <>
            {!user && (
                <div>
                    <button
                        className="sign-in"
                        onClick={onClickGoogleHandler}
                        style={{ display: 'block' }}
                    >
                        Join with Google
                    </button>
                    <span>OR</span>
                    <div>
                        <label htmlFor="name">Your Name</label>
                        <input
                            id="name"
                            placeholder="Enter name"
                            onChange={(evt) => setName(evt.target.value)}
                        ></input>
                    </div>
                    <button
                        className="sign-in"
                        onClick={onClickAnonymousHandler}
                        disabled={!name}
                    >
                        Join Anonymously
                    </button>
                </div>
            )}
            {user && (
                <div>
                    <label htmlFor="currency">Currency</label>
                    <select
                        id="currency"
                        defaultValue=""
                        onChange={(evt) => setCurrency(evt.target.value)}
                    >
                        <option value="" disabled>
                            Select currency
                        </option>
                        {currencies.map((c) => (
                            <option key={c} value={c}>
                                {c.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    <button
                        className="select-currency"
                        onClick={onClickContinue}
                        disabled={!currency}
                    >
                        Select currency
                    </button>
                </div>
            )}
        </>
    )
}
