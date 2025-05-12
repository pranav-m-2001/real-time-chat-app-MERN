import React, { useEffect } from "react"
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import SignUp from "./pages/Signup"
import Login from "./pages/Login"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import { useAuthStore } from "./store/useAuthStore"
import { Loader } from 'lucide-react'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { useThemeStore } from "./store/useThemeStore"

function App(): React.ReactNode {
  
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
  const { theme } = useThemeStore()

  console.log(onlineUsers)

  useEffect(()=>{
    checkAuth()
  },[])

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)    
  },[theme])



  if(isCheckingAuth && !authUser) return(
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div data-theme={theme}>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <Home/> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUp/> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <Login/> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <Settings/> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <Profile/> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}
 
export default App
