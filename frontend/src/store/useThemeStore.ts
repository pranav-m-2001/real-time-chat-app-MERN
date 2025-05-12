import { create } from 'zustand'
import { ThemeData } from '../models'

export const useThemeStore = create<ThemeData>((set)=>({
    theme : localStorage.getItem('chat-theme') || 'coffee',
    setTheme: (theme)=>{
        localStorage.setItem('chat-theme', theme)
        set({theme: theme})
    }
}))