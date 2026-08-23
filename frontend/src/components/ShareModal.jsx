import { useState } from 'react';
import { Share2, Link, Copy, Check, X, Twitter, Linkedin } from 'lucide-react';
import toast from 'react-hot-toast';

function ShareModal({ idea, onClose }) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Team Architect', text: 'Clean 3NF relational schema and scalable cloud tiers.', timestamp: '5 min ago' },
  ]);

  const [shareId] = useState(() => {
    const timestamp = Math.floor(Date.now() / 1000);
    return btoa(JSON.stringify({ idea: idea.substring(0, 50), ts: timestamp })).substring(0, 16);
  });
  
  const shareUrl = `${window.location.origin}/share/${shareId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Share link copied!', { icon: '⚡' });
    });
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    setComments(c => [...c, {
      id: Date.now(),
      author: email || 'Lead Engineer',
      text: comment,
      timestamp: 'Just now',
    }]);
    setComment('');
    toast.success('Comment logged!', { icon: '💬' });
  };

  const twitterText = encodeURIComponent(`Check out this AI-generated architecture for: ${idea.substring(0, 80)}... ${shareUrl}`);
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000000] w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-[#FFE600] border-b-3 border-black text-black">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="stroke-[3]" />
            <h2 className="font-display font-black text-base sm:text-lg uppercase">
              SHARE ARCHITECTURE
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-white border-2 border-black hover:bg-[#FF5500] hover:text-white transition-colors"
          >
            <X size={16} className="stroke-[3]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FDF6E3]">
          {/* Share link */}
          <div>
            <p className="font-mono text-xs font-black uppercase text-black mb-2 flex items-center gap-1.5">
              <Link size={14} className="stroke-[2.5]" />
              PERMANENT REVISION LINK
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 font-mono text-xs font-bold bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] text-black select-all"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-2 bg-[#00FF00] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] transition-all font-mono text-xs font-bold uppercase flex-shrink-0"
              >
                {copied ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} className="stroke-[2.5]" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
          </div>

          {/* Social share */}
          <div>
            <p className="font-mono text-xs font-black uppercase text-black mb-2">BROADCAST TO NETWORK</p>
            <div className="flex gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${twitterText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-[#00FFFF] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#00FF00] active:translate-x-[1px] active:translate-y-[1px] font-mono text-xs font-bold uppercase transition-all"
              >
                <Twitter size={14} className="stroke-[2.5]" /> TWITTER / X
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-[#FF00FF] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FF5500] active:translate-x-[1px] active:translate-y-[1px] font-mono text-xs font-bold uppercase transition-all"
              >
                <Linkedin size={14} className="stroke-[2.5]" /> LINKEDIN
              </a>
            </div>
          </div>

          {/* Comments section */}
          <div>
            <p className="font-mono text-xs font-black uppercase text-black mb-2">ENGINEERING TEAM COMMENTS</p>
            <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
              {comments.map(c => (
                <div key={c.id} className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-black text-black">{c.author}</span>
                    <span className="font-mono text-[10px] text-gray-600">{c.timestamp}</span>
                  </div>
                  <p className="font-mono text-xs text-gray-800 font-medium">{c.text}</p>
                </div>
              ))}
            </div>

            <input
              type="email"
              placeholder="Your email / Handle (optional)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-1.5 font-mono text-xs font-bold bg-white border-2 border-black mb-2 text-black"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add architectural review notes..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                className="flex-1 px-3 py-1.5 font-mono text-xs font-bold bg-white border-2 border-black text-black"
              />
              <button
                onClick={handleAddComment}
                className="px-3 py-1.5 bg-[#00FF00] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] font-mono text-xs font-bold uppercase"
              >
                POST
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
