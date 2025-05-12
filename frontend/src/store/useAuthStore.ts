import { create } from 'zustand'
import { AuthStore } from '../models'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-toastify'
import { io } from 'socket.io-client'

const BASE_URL: string = import.meta.env.MODE === 'development' ? 'http://localhost:4000' : '/'


export const useAuthStore = create<AuthStore>((set,get)=> ({
    authUser: null,
    isSigningup: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],
    checkAuth:async ()=>{
        try{

            const { data } = await axiosInstance.get('/auth/check')
            set({authUser: data.userData})
            get().connectSocket()
        }catch(error){
            if(error instanceof Error){
                console.error('Error in check auth', error.message)
            }
            set({authUser: null})
        }finally{
            set({isCheckingAuth: false})
        }
    },

    signup: async (data)=>{
        try{
            set({isSigningup: true})
            const response = await axiosInstance.post('/auth/signup', data)
            if(response.data.success){
                set({authUser: response.data.userData})
                toast.success('Account created successfully')
            }else{
                toast.error('Error occured')
            }

        }catch(error: any){
            if(error instanceof Error){
                console.error('Error in signup', error.message)
            }
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }
        }finally{
            set({isSigningup: false})
        }
    },

    logout: async ()=> {
        try{

            const response = await axiosInstance.post('/auth/logout')
            if(response.data.success){
                set({authUser: null})
                toast.success('logged out successfully')
                get().disconnectSocket()
            }

        }catch(error: any){
            if(error instanceof Error){
                console.error('Error in logout', error.message)
            }
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }
        }
    },

    login: async (data)=>{
        try{
            set({isLoggingIn: true})
            const response = await axiosInstance.post('/auth/login', data)
            if(response.data.success){
                set({authUser: response.data.userData})
                toast.success('Logged in successfully')
                get().connectSocket()
            }

        }catch(error:any){
            if(error instanceof Error){
                console.error('Error in login', error.message)
            }
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }
        }finally{
            set({isLoggingIn: false})
        }
    },

    updateProfile : async (data)=>{
        try{
            set({isUpdatingProfile: true})
            const response = await axiosInstance.put('/auth/update-profile', data)
            if(response.data.success){
                set({authUser: response.data.userData})
                toast.success('Profile updated successfully')
            }
        }catch(error:any){
            if(error instanceof Error){
                console.error('Error in updateProfile', error.message)
            }
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }
        }finally{
            set({isUpdatingProfile: false})
        }
    },

    connectSocket: async ()=>{
        const { authUser } = get()
        if(!authUser || get().socket?.connected) return

        const socket = io(BASE_URL,{
            query: {userId: authUser._id}
        })
        socket.connect()
        set({socket: socket})

        socket.on('getOnlineUsers', (userIds)=>{
            set({onlineUsers: userIds})
        })

    },

    disconnectSocket: async ()=>{
        if(get().socket?.connected) get().socket.disconnect()
    }
}))