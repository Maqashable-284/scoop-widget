import React from 'react';

interface SidebarProps {
    conversations: { id: string; title: string }[];
    activeConversation: string | null;
    onNewChat: () => void;
    onSelectConversation: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    conversations,
    activeConversation,
    onNewChat,
    onSelectConversation,
}) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <button className="new-chat-btn" onClick={onNewChat}>
                    <span>✨</span>
                    ახალი საუბარი
                </button>
            </div>

            <div className="chat-history">
                <div className="history-title">ბოლო საუბრები</div>
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        className={`history-item ${activeConversation === conv.id ? 'active' : ''}`}
                        onClick={() => onSelectConversation(conv.id)}
                    >
                        {conv.title}
                    </div>
                ))}
                {conversations.length === 0 && (
                    <div className="history-item" style={{ color: '#9ca3af' }}>
                        საუბრები არ არის
                    </div>
                )}
            </div>

            <button className="about-btn">
                <span>ℹ️</span>
                ასისტენტის შესახებ
            </button>
        </div>
    );
};
