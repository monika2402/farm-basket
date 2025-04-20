import React from 'react'

const UserContext = React.createContext({
  isAdmin: false,
  setIsAdmin: () => {}
})

export default UserContext
