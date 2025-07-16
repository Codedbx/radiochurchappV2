import React from 'react'
import { Button } from './ui/button'
import { MessageCircle } from 'lucide-react'

const CommentButton = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        className="w-14 h-14 bg-service-red hover:bg-service-red/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white text-service-red rounded-full text-xs font-bold flex items-center justify-center">
          1
        </div>
      </Button>
    </div>
  )
}

export default CommentButton
