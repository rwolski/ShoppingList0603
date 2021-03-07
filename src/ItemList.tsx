import React, { FC, useCallback } from 'react'
import { firebaseApp } from './Firebase'
import { Item, ItemModel } from './Item'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { useCollectionData } from 'react-firebase-hooks/firestore'

interface ItemListProps {
    currency: string
}

const firestore = firebaseApp.firestore()

const converter = {
    toFirestore: (data: ItemModel) => data,
    fromFirestore: (snap: firebase.firestore.DocumentData) =>
        snap.data() as ItemModel,
}

export const ItemList: FC<ItemListProps> = ({ currency }) => {
    const itemsRef = firestore.collection('items').withConverter(converter)
    const query = itemsRef
        .where('currency', '==', currency)
        .orderBy('name')
        .limit(25)

    const [items, loading, err] = useCollectionData<ItemModel>(query, {
        idField: 'id',
    })

    const onSaveHandler = useCallback(
        (item: ItemModel) => {
            const { id, ...data } = item
            itemsRef.doc(item.id).set(data)
        },
        [itemsRef]
    )

    const onDeleteHandler = useCallback(
        (id: string) => {
            itemsRef.doc(id).delete()
        },
        [itemsRef]
    )

    return (
        <div>
            {!loading && items && (
                <>
                    {items.map((i) => (
                        <Item
                            key={i.id || i.name}
                            {...currency}
                            {...i}
                            onSave={onSaveHandler}
                            onDelete={onDeleteHandler}
                        />
                    ))}
                    <Item
                        currency={currency}
                        onSave={onSaveHandler}
                        onDelete={onDeleteHandler}
                    />
                </>
            )}
            {err && <span>Oops</span>}
        </div>
    )
}
