import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
    const [paints, setPaints] = useLocalStorage('pc.paints', [])
    const [shoppingList, purchases, setShoppingList, setPurchase] =
        useLocalStorage('pc.shopping', [])

    function addPaint(paint) {
        setPaints((prev) => [...prev, paint])
    }

    function addToShoppingList(item) {
        setShoppingList((prev) => [...prev, item])
    }

    function addToPurchases(purchase) {
        setPurchase((prev) => [...prev, purchase])
    }

    const value = {
        paints,
        shoppingList,
        purchases,
        addPaint,
        addToShoppingList,
        addToPurchases,
    }

    return (
        <AppDataContext.Provider value={value}>
            {children}
        </AppDataContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppData() {
    return useContext(AppDataContext)
}
