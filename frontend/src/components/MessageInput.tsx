import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { X, Image, Send } from 'lucide-react'
import { toast } from "react-toastify";

function MessageInput(): React.ReactNode{

    const [text, setText] = useState<string>('')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const { sendMessage } = useChatStore()

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>){
        const file = event.target.files?.[0]
        if(!file?.type.startsWith('image/')){
            toast.error('Please select an image file')
            return
        }

        const reader = new FileReader()
        reader.onload = ()=>{
            if(typeof reader.result === 'string'){
                setImagePreview(reader.result)
            }
        }
        reader.readAsDataURL(file)
    }

    function removeImage(){
        setImagePreview(null)
        if(fileInputRef.current) fileInputRef.current.value = ''
    }

    async function handleSendMessage(event: React.FormEvent){
        event.preventDefault()
        if(!text.trim() && !imagePreview) return
        try{

            await sendMessage({text: text.trim(), image: imagePreview})
            setText('')
            setImagePreview(null)
            if(fileInputRef.current) fileInputRef.current.value = ''

        }catch(error: any){
            console.error('Failed to send message', error)
        }
    }

    return(
        <div className="p-4 w-full">
            {
                imagePreview && (
                    <div className="mb-3 flex items-center gap-2">
                        <div className="relative">
                            <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />
                            <button className="absolute -top-1.5 -right-2.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center" type="button" onClick={removeImage}>
                                <X className="size-3" />
                            </button>
                        </div>
                    </div>
                )
            }
            <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
                <div className="flex-1 flex gap-2">
                    <input type="text" placeholder="Type a message..." value={text} onChange={(event)=>setText(event.target.value)}  className="w-full input input-bordered rounded-lg input-sm sm:input-md" />
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                    <button type="button" className={`hidden sm:flex btn btn-circle ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`} onClick={()=> fileInputRef.current?.click()}>
                        <Image size={20} />
                    </button>
                </div>
                <button type="submit" className="btn btn-sm btn-circle" disabled={!text.trim() && !imagePreview}>
                    <Send size={22} />
                </button>
            </form>
        </div>
    )

}

export default MessageInput