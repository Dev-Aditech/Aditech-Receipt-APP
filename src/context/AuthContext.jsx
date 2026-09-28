// "Context" lets any component ask: who is logged in, and what is their business?
// Without it we would have to pass this information down through every component.
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)         // the logged-in person (or null)
  const [business, setBusiness] = useState(null) // their business profile from Firestore
  const [loading, setLoading] = useState(true)   // true until we know who is logged in

  useEffect(() => {
    let stopWatchingBusiness = null

    // Firebase tells us whenever someone logs in or out
    const stopWatchingAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)

      if (stopWatchingBusiness) {
        stopWatchingBusiness()
        stopWatchingBusiness = null
      }

      if (!firebaseUser) {
        setBusiness(null)
        setLoading(false)
        return
      }

      // Watch the business document live. Edits in Settings show up instantly.
      stopWatchingBusiness = onSnapshot(
        doc(db, 'businesses', firebaseUser.uid),
        (snap) => {
          setBusiness(snap.exists() ? { id: snap.id, ...snap.data() } : null)
          setLoading(false)
        },
        (error) => {
          console.error(error)
          setLoading(false)
        }
      )
    })

    // Cleanup when the component goes away
    return () => {
      stopWatchingAuth()
      if (stopWatchingBusiness) stopWatchingBusiness()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, business, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// A shortcut so other files can write:  const { user, business } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
