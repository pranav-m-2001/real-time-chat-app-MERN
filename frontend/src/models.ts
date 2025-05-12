export interface AuthStore  {
    authUser: any,
    isSigningup: boolean,
    isLoggingIn: boolean,
    isUpdatingProfile: boolean
    isCheckingAuth: boolean | null,
    socket: any,
    onlineUsers: number[],
    checkAuth: ()=> void,
    signup: (data: SignupFormData)=> void,
    logout: ()=> void,
    login: (data: LoginFormData) => void,
    updateProfile: (data: {profilePic: any}) => void,
    connectSocket: ()=> void,
    disconnectSocket: ()=> void
}

export interface SignupFormData {
    fullName: string,
    email: string,
    password: string
}

export interface LoginFormData {
    email: string,
    password: string
}

export interface ThemeData {
    theme: string,
    setTheme: (theme: string)=> void,
    
}

export interface ChatData {
    messages: string[],
    users: string[],
    selectedUser: any,
    isUsersLoading: boolean,
    isMessageLoading: boolean
    getUsers: ()=> void,
    getMessages: (userId: number) => void,
    setSelectedUser: (selectedUser: any) => void,
    sendMessage: (messageData: {text: string, image: string | null}) => void,
    subscribeToMessage: ()=> void,
    unsubscribeFromMessage: ()=> void
}