import React, { FC, useCallback, useContext, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { AuthContext } from './AuthContext'

export interface ItemModel {
    id?: string
    name: string
    value: number
    currency: string
    uid: string
}

export interface ItemProps extends Partial<ItemModel> {
    currency: string
    onSave: (item: ItemModel) => void
    onDelete: (id: string) => void
}

export const Item: FC<ItemProps> = ({
    currency,
    id,
    name,
    value,
    uid: ownerId,
    onSave,
    onDelete,
}) => {
    const auth = useContext(AuthContext)
    const [user] = useAuthState(auth)
    const [editing, setEditing] = useState(false)

    const [newName, setNewName] = useState(name)
    const [newValue, setNewValue] = useState(value)

    const onEditHandler = useCallback(() => {
        if (editing) {
            setNewName(name)
            setNewValue(value)
        }
        setEditing(!editing)
    }, [editing, name, value])

    const onSaveHandler = useCallback(() => {
        if (newName && newValue && user && currency) {
            onSave({
                id: id,
                name: newName,
                value: newValue,
                uid: user?.uid,
                currency,
            })
        }
        setEditing(false)

        if (!id) {
            setNewName('')
            setNewValue(0)
        }
    }, [currency, id, newName, newValue, onSave, user])

    return (
        <div>
            <div style={{ marginRight: '60px', display: 'inline-block' }}>
                {!(editing || !id) ? (
                    <>
                        <span style={{ marginRight: '20px' }}>{name}</span>
                        <span>{value}</span>
                    </>
                ) : (
                    <>
                        <input
                            value={newName}
                            onChange={(evt) => setNewName(evt.target.value)}
                        />
                        <input
                            type="number"
                            value={newValue}
                            onChange={(evt) =>
                                setNewValue(parseFloat(evt.target.value))
                            }
                        />
                    </>
                )}
            </div>
            <div style={{ display: 'inline-block' }}>
                {user && user.uid === ownerId && (
                    <>
                        {!editing && id && (
                            <>
                                <button onClick={onEditHandler}>Edit</button>
                                <button onClick={() => onDelete(id)}>
                                    Delete
                                </button>
                            </>
                        )}
                        {editing && (
                            <>
                                <button onClick={onEditHandler}>Cancel</button>
                                <button onClick={onSaveHandler}>Save</button>
                            </>
                        )}
                    </>
                )}
                {user && !id && <button onClick={onSaveHandler}>Save</button>}
            </div>
        </div>
    )
}
