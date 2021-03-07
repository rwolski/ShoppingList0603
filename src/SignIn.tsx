import { FC, useCallback, useState, useContext } from 'react'
import { AuthContext } from './AuthContext'
import firebase from 'firebase/app'
import { currencies } from './Currency'

interface SignInProps {
    onSignIn: (id: string, name: string, currency: string) => void
}

export const SignIn: FC<SignInProps> = ({ onSignIn }) => {
    const auth = useContext(AuthContext)
    const [name, setName] = useState('')
    const [currency, setCurrency] = useState('')

    const onClickAnonymousHandler = useCallback(() => {
        auth.signInAnonymously().then((credentials) => {
            if (credentials.user) {
                credentials.user.updateProfile({ displayName: name })
                if (credentials.additionalUserInfo) {
                    credentials.additionalUserInfo.profile = { currency }
                }
                onSignIn?.(credentials.user.uid, name, currency)
                localStorage.setItem(
                    `${credentials.user.uid}-currency`,
                    currency
                )
            }
        })
    }, [auth, currency, name, onSignIn])

    const onClickGoogleHandler = useCallback(() => {
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider).then((credentials) => {
            if (credentials.user) {
                onSignIn?.(
                    credentials.user.uid,
                    credentials.user.displayName || credentials.user.uid,
                    currency
                )
            }
        })
    }, [auth, currency, onSignIn])

    return (
        <>
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
            </div>

            <button
                className="sign-in"
                onClick={onClickGoogleHandler}
                disabled={!currency}
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
                disabled={!name || !currency}
            >
                Join Anonymously
            </button>
        </>
    )
}
