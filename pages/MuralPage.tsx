
import React, { useState } from 'react';
import { Card } from '../components/Card.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Comment, MuralPost, User } from '../types.ts';
import { userMap } from '../data/allData.ts';
import { ThumbsUpIcon, MessageCircleIcon } from '../components/icons.tsx';
import { useApi } from '../context/ApiContext.tsx';
import { SkeletonLoader } from '../components/skeletons/SkeletonLoader.tsx';

interface CommentSectionProps {
    post: MuralPost;
    currentUser: User;
}

const CommentSection: React.FC<CommentSectionProps> = ({ post, currentUser }) => {
    const { addMuralComment } = useApi();
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(newComment.trim()) {
            setIsSubmitting(true);
            await addMuralComment(post.id, currentUser.id, newComment);
            setIsSubmitting(false);
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
                    disabled={isSubmitting}
                />
                <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 text-sm disabled:opacity-50" disabled={isSubmitting || !newComment.trim()}>
                    {isSubmitting ? '...' : 'Comentar'}
                </button>
            </form>
        </div>
    )
}

interface PostCardProps {
    post: MuralPost;
    currentUser: User;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser }) => {
    const { likeMuralPost } = useApi();
    const author = userMap.get(post.authorId);
    const [showComments, setShowComments] = useState(false);
    const hasLiked = post.likes.includes(currentUser.id);

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
                <button onClick={() => likeMuralPost(post.id, currentUser.id)} className={`flex items-center text-sm transition-colors ${hasLiked ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-white'}`}>
                    <ThumbsUpIcon className="w-4 h-4 mr-1.5"/> 
                    {post.likes.length} Curtir
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center text-sm text-slate-400 hover:text-white transition-colors">
                    <MessageCircleIcon className="w-4 h-4 mr-1.5"/>
                    {post.comments.length} Comentários
                </button>
            </div>
            {showComments && <CommentSection post={post} currentUser={currentUser} />}
        </Card>
    );
};

export const MuralPage: React.FC = () => {
    const { user } = useAuth();
    const { data, isLoading, addMuralPost } = useApi();
    const { muralPosts: posts = [] } = data || {};

    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const handleAddPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim() || !user) return;
        setIsPosting(true);
        await addMuralPost(user.id, newPostContent);
        setIsPosting(false);
        setNewPostContent('');
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
                        disabled={isPosting}
                    />
                    <div className="flex justify-end mt-3">
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50" disabled={isPosting || !newPostContent.trim()}>
                            {isPosting ? 'Postando...' : 'Postar'}
                        </button>
                    </div>
                </form>
            </Card>

            <div>
                {isLoading ? (
                     <div className="space-y-4">
                        <SkeletonLoader className="h-40" />
                        <SkeletonLoader className="h-32" />
                    </div>
                ) : posts.length === 0 ? (
                    <Card className="text-center text-slate-500 py-8">
                        O mural está vazio. Seja o primeiro a postar!
                    </Card>
                ) : (
                    posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(post => (
                        <PostCard key={post.id} post={post} currentUser={user} />
                    ))
                )}
            </div>
        </div>
    );
};