import { useState } from 'react';
import { Share2, Link, Copy, Check, X, Twitter, Linkedin } from 'lucide-react';
import toast from 'react-hot-toast';

function ShareModal({ idea, onClose }) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Team Member', text: 'Great architecture choice for the scale!', timestamp: '5 min ago' },
  ]);

  // Generate a "share link" (in production this would be a real backend URL)
  // Create stable share URL without Date.now() in render
  const [shareId] = useState(() => {
    const timestamp = Math.floor(Date.now() / 1000);
    return btoa(JSON.stringify({ idea: idea.substring(0, 50), ts: timestamp })).substring(0, 16);
  });
  
  const shareUrl = `${window.location.origin}/share/${shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copied!');
    });
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    setComments(c => [...c, {
      id: Date.now(),
      author: email || 'You',
      text: comment,
      timestamp: 'Just now',
    }]);
    setComment('');
    toast.success('Comment added!');
  };

  const twitterText = encodeURIComponent(`Check out this AI-generated architecture for: ${idea.substring(0, 80)}... ${shareUrl}`);
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Share2 size={20} className="text-indigo-500" /> Share Architecture
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Share link */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Link size={14} /> Shareable Link
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 select-all"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition flex-shrink-0"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Social share */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Share on Social</p>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${twitterText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 transition"
              >
                <Twitter size={16} /> Twitter
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
          </div>

          {/* Comments section */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Team Comments</p>
            <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
              {comments.map(c => (
                <div key={c.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">{c.author}</span>
                    <span className="text-xs text-gray-400">{c.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{c.text}</p>
                </div>
              ))}
            </div>

            <input
              type="email"
              placeholder="Your email (optional)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg mb-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
