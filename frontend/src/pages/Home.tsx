import React from "react";
import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

function Home(): React.ReactNode{

    const { selectedUser } = useChatStore()

    return(
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-7xl h-[calc(100vh-6rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        <Sidebar/>
                        {
                            !selectedUser ? <NoChatSelected/>
                            : <ChatContainer/>
                        }
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Home