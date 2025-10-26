import React, { useState } from 'react';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { MuralPost, Comment } from '../types';
import { userMap } from '../data/users';
import { ThumbsUpIcon, MessageCircleIcon } from '../components/icons';

interface MuralPageProps {
  posts: MuralPost[];
  setPosts: React.Dispatch<React.SetStateAction<MuralPost[]>>;
}

const CommentSection: React.FC<{ post: MuralPost, onAddComment: (postId: string, content: string) => void }> = ({ post, onAddComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(newComment.trim()) {
            onAddComment(post.id, newComment);
            setNewComment('');
        }
    };

    return (
        <div className="mt-4 pt-3 border-t border-slate-700/50">
            {post.comments.map(comment => {
                const author = userMap.get(comment.authorId);
                return (
                    <div key={comment.id} className="flex items-start space-x-2 mt-2">
                        <img src={author?.avatarUrl} alt={author?.name} className="w-6 h-6 rounded-full"/>
                        <div className="bg-slate-700/50 rounded-lg p-2 text-sm flex-1">
                            <p className="font-semibold text-slate-200 text-xs">{author?.name}</p>
                            <p className="text-slate-300">{comment.content}</p>
                        </div>
                    </div>
                )
            })}
            <form onSubmit={handleSubmit} className="mt-3 flex space-x-2">
                <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="flex-1 px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                />
                <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 text-sm">Comentar</button>
            </form>
        </div>
    )
}

const PostCard: React.FC<{ post: MuralPost; onLike: (postId: string) => void; onAddComment: (postId: string, content: string) => void; currentUserId: string; }> = ({ post, onLike, onAddComment, currentUserId }) => {
    const author = userMap.get(post.authorId);
    const [showComments, setShowComments] = useState(false);
    const hasLiked = post.likes.includes(currentUserId);

    return (
        <Card className="mb-4">
            <div className="flex items-center">
                <img src={author?.avatarUrl} alt={author?.name} className="w-10 h-10 rounded-full"/>
                <div className="ml-3">
                    <p className="font-semibold text-slate-100">{author?.name}</p>
                    <p className="text-xs text-slate-400">{new Date(post.timestamp).toLocaleString('pt-BR')}</p>
                </div>
            </div>
            <p className="mt-4 text-slate-300 whitespace-pre-wrap">{post.content}</p>
            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center space-x-4">
                <button onClick={() => onLike(post.id)} className={`flex items-center text-sm transition-colors ${hasLiked ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-white'}`}>
                    <ThumbsUpIcon className="w-4 h-4 mr-1.5"/> 
                    {post.likes.length} Curtir
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center text-sm text-slate-400 hover:text-white transition-colors">
                    <MessageCircleIcon className="w-4 h-4 mr-1.5"/>
                    {post.comments.length} Comentários
                </button>
            </div>
            {showComments && <CommentSection post={post} onAddComment={onAddComment} />}
        </Card>
    );
};

export const MuralPage: React.FC<MuralPageProps> = ({ posts, setPosts }) => {
    const { user } = useAuth();
    const [newPostContent, setNewPostContent] = useState('');

    const handleAddPost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim() || !user) return;
        const newPost: MuralPost = {
            id: `post-${Date.now()}`,
            authorId: user.id,
            content: newPostContent,
            timestamp: new Date().toISOString(),
            likes: [],
            comments: []
        };
        setPosts(prev => [newPost, ...prev]);
        setNewPostContent('');
    };

    const handleLike = (postId: string) => {
        if (!user) return;
        setPosts(prevPosts => prevPosts.map(p => {
            if (p.id === postId) {
                const newLikes = p.likes.includes(user.id)
                    ? p.likes.filter(uid => uid !== user.id)
                    : [...p.likes, user.id];
                return { ...p, likes: newLikes };
            }
            return p;
        }));
    };

    const handleAddComment = (postId: string, content: string) => {
        if (!user) return;
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            authorId: user.id,
            content,
            timestamp: new Date().toISOString()
        };
        setPosts(prevPosts => prevPosts.map(p => 
            p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
        ));
    };

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto">
            <Card className="mb-6">
                <form onSubmit={handleAddPost}>
                    <textarea 
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder={`No que você está pensando, ${user.name}?`}
                        className="w-full h-24 p-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <div className="flex justify-end mt-3">
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50" disabled={!newPostContent.trim()}>
                            Postar
                        </button>
                    </div>
                </form>
            </Card>

            <div>
                {posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(post => (
                    <PostCard key={post.id} post={post} onLike={handleLike} onAddComment={handleAddComment} currentUserId={user.id} />
                ))}
            </div>
        </div>
    );
};