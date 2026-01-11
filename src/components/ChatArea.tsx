import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SuggestionCards } from './SuggestionCards';

interface QuickReply {
    title: string;
    payload: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    quickReplies?: QuickReply[];
}

interface ChatAreaProps {
    messages: Message[];
    isLoading: boolean;
    showWelcome: boolean;
    inputValue: string;
    onInputChange: (value: string) => void;
    onSendMessage: () => void;
    onCardClick: (payload: string) => void;
    onQuickReplyClick: (payload: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
    messages,
    isLoading,
    showWelcome,
    inputValue,
    onInputChange,
    onSendMessage,
    onCardClick,
    onQuickReplyClick,
}) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    // Get the last message's quick replies (if any)
    const lastMessage = messages[messages.length - 1];
    const showQuickReplies = lastMessage?.role === 'assistant' && lastMessage?.quickReplies && lastMessage.quickReplies.length > 0;

    return (
        <div className="chat-area">
            {/* Header */}
            <div className="chat-header">
                <div className="chat-header-title">🍨 Scoop AI ასისტენტი</div>
                <div className="chat-header-actions">
                    <button className="chat-header-btn">—</button>
                    <button className="chat-header-btn">⤢</button>
                    <button className="chat-header-btn">✕</button>
                </div>
            </div>

            {/* Chat Content */}
            <div className="chat-content">
                {showWelcome ? (
                    <>
                        {/* Welcome Section */}
                        <div className="welcome-section">
                            <div className="avatar">
                                <div className="avatar-inner">🍨</div>
                            </div>
                            <h2 className="welcome-title">
                                გამარჯობა. მე ქირონი ვარ
                                <br />
                                რით შემიძლია დაგეხმაროთ?
                            </h2>
                            <p className="welcome-subtitle">
                                აირჩიე ტოპ 4 თემიდან ერთ-ერთი ან მომწერეთ თქვენთვის საჭირველი შეკითხვა
                            </p>
                        </div>

                        {/* Suggestion Cards */}
                        <SuggestionCards onCardClick={onCardClick} />
                    </>
                ) : (
                    /* Messages */
                    <div className="messages-container">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.role}`}>
                                <div className="message-avatar"></div>
                                <div className="message-content">
                                    {msg.role === 'assistant' ? (
                                        <ReactMarkdown
                                            components={{
                                                // Custom link rendering - open in new tab
                                                a: ({ href, children }) => (
                                                    <a href={href} target="_blank" rel="noopener noreferrer">
                                                        {children}
                                                    </a>
                                                ),
                                                // Style headers
                                                h3: ({ children }) => (
                                                    <h3 className="md-header">{children}</h3>
                                                ),
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Streaming Loading Indicator */}
                        {isLoading && messages[messages.length - 1]?.content === '' && (
                            <div className="message assistant">
                                <div className="message-avatar"></div>
                                <div className="message-content">
                                    <span className="typing-indicator">🔍 ვაგენერირებ პასუხს...</span>
                                </div>
                            </div>
                        )}

                        {/* Quick Replies */}
                        {!isLoading && showQuickReplies && (
                            <div className="quick-replies-container">
                                <div className="quick-replies-label">💡 შემდეგი ნაბიჯები:</div>
                                <div className="quick-replies">
                                    {lastMessage.quickReplies!.map((qr, index) => (
                                        <button
                                            key={index}
                                            className="quick-reply-btn"
                                            onClick={() => onQuickReplyClick(qr.payload)}
                                        >
                                            {qr.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="input-area">
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="message-input"
                        placeholder="დაწერე Scoop ასისტენტს..."
                        value={inputValue}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <button
                        className="send-btn"
                        onClick={onSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <span>➤</span>
                        გაგზავნა
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="chat-footer">
                მოცემული განმარტებითა ხელოვნური ინტელექტის მიერ, გთხოვთ გადაამოწმოთ მნიშვნელოვანი ინფორმაცია
            </div>
        </div>
    );
};
