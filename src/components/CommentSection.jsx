import { useState } from 'react';
import { MessageCircle, User, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function CommentSection() {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "TLB",
      message: "Please leave a message if you rae participating here. Thanks",
      time: "9 months ago"
    },
    {
      id: 2,
      name: "TLB",
      message: "goodmorning",
      time: "9 months ago"
    },
    {
      id: 3,
      name: "Winifred Makpah",
      message: "God bless you Pastor",
      time: "8 months ago"
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && userName.trim()) {
      const comment = {
        id: comments.length + 1,
        name: userName,
        message: newComment,
        time: "Just now"
      };
      setComments([comment, ...comments]);
      setNewComment('');
      setUserName('');
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-accent rounded-2xl mb-4 shadow-lg">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Community Comments
        </h3>
        <p className="text-gray-600">
          Share your thoughts and connect with others
        </p>
      </div>

      {/* Existing Comments */}
      <div className="space-y-4 mb-8 max-h-80 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">{comment.name}</span>
                <span className="text-sm text-gray-500 ml-2">{comment.time}</span>
              </div>
            </div>
            <p className="text-gray-700 ml-11">{comment.message}</p>
          </div>
        ))}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="md:flex md:items-end">
            <Button 
              type="submit"
              className="w-full md:h-12 bg-gradient-accent hover:scale-105 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>
        
        <div>
          <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Message
          </label>
          <Textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts, prayer requests, or testimonies..."
            className="w-full resize-none border-2 border-gray-200 focus:border-primary rounded-2xl p-4 text-gray-700 placeholder:text-gray-400 transition-colors duration-300"
            rows={4}
            required
          />
        </div>
      </form>
    </Card>
  );
}