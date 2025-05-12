import { create } from 'zustand'
import { ChatData } from '../models'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-toastify'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create<ChatData>((set,get)=>({
    messages: [],
    users: [],
    onlineUsers: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessageLoading: false,
    getUsers: async ()=>{
        try{
            set({isUsersLoading: true})

            const response = await axiosInstance.get('/message/users')
            if(response.data.success){
                set({users: response.data.users})
            }

        }catch(error:any){
             if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }
        }finally{
            set({isUsersLoading: false})
        }
    },
    getMessages: async (userId)=>{
        try{
            set({isMessageLoading: true})
            const response = await axiosInstance.get(`/message/${userId}`)
            if(response.data.success){
                set({messages: response.data.messages})
            }
        }catch(error: any){
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }
        }finally{
            set({isMessageLoading: false})
        }
    },
    setSelectedUser: (selectedUser) => {
        set({selectedUser})
    },
    
    sendMessage: async (messageData)=>{
        try{

            const { selectedUser,messages } = get()

            set({isMessageLoading: true})
            const response = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
            if(response.data.success){
                set({messages: [...messages, response.data.message]})
            }

        }catch(error: any){
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }
        }finally{
            set({isMessageLoading: false})
        }
    },
    subscribeToMessage: ()=>{
        const { selectedUser } = get()
        const socket = useAuthStore.getState().socket
        socket.on('newMessage', (newMessage:any)=>{
            if(newMessage.senderId !== selectedUser._id) return
            
            set({messages: [...get().messages, newMessage]})
        })
    },
    unsubscribeFromMessage: ()=>{
        const socket = useAuthStore.getState().socket
        socket.off('newMessage')
    }


}))