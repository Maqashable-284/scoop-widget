import { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import './styles/widget.css';

// Backend API URL (change for production)
const BACKEND_URL = 'https://scoop-ai-sdk-358331686110.europe-west1.run.app';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  quickReplies?: QuickReply[];
}

interface QuickReply {
  title: string;
  payload: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];
  const showWelcome = messages.length === 0;

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createNewConversation = useCallback(() => {
    const newConv: Conversation = {
      id: generateId(),
      title: 'ახალი საუბარი',
      messages: [],
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    return newConv.id;
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    let convId = activeConversationId;
    if (!convId) {
      convId = createNewConversation();
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: text,
    };

    // Add user message
    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
          messages: [...conv.messages, userMessage],
        };
      }
      return conv;
    }));

    setInputValue('');
    setIsLoading(true);

    // Create placeholder for streaming response
    const assistantMessageId = generateId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    };

    // Add empty assistant message (will be filled via streaming)
    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          messages: [...conv.messages, assistantMessage],
        };
      }
      return conv;
    }));

    try {
      // Use streaming endpoint
      const response = await fetch(`${BACKEND_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: `widget_${convId}`,
          message: text,
          conversation_id: convId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          // Parse SSE events
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data && data !== '{}') {
                fullResponse += data;

                // Update message content in real-time
                setConversations(prev => prev.map(conv => {
                  if (conv.id === convId) {
                    return {
                      ...conv,
                      messages: conv.messages.map(msg =>
                        msg.id === assistantMessageId
                          ? { ...msg, content: fullResponse }
                          : msg
                      ),
                    };
                  }
                  return conv;
                }));
              }
            }
          }
        }
      }

      // Fallback: if streaming didn't work, use regular endpoint
      if (!fullResponse) {
        const fallbackResponse = await fetch(`${BACKEND_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: `widget_${convId}`,
            message: text,
          }),
        });
        const data = await fallbackResponse.json();
        fullResponse = data.response_text_geo || data.response || 'ბოდიში, პასუხი ვერ მივიღე.';

        // Update with fallback response
        setConversations(prev => prev.map(conv => {
          if (conv.id === convId) {
            return {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.id === assistantMessageId
                  ? { ...msg, content: fullResponse }
                  : msg
              ),
            };
          }
          return conv;
        }));
      }

    } catch (error) {
      console.error('Error sending message:', error);

      // Update with error message
      setConversations(prev => prev.map(conv => {
        if (conv.id === convId) {
          return {
            ...conv,
            messages: conv.messages.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: '⚠️ სამწუხაროდ, კავშირის შეცდომა მოხდა. გთხოვთ სცადოთ თავიდან.' }
                : msg
            ),
          };
        }
        return conv;
      }));
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, createNewConversation]);

  const handleSendMessage = () => {
    sendMessage(inputValue);
  };

  const handleCardClick = (payload: string) => {
    sendMessage(payload);
  };

  const handleQuickReplyClick = (payload: string) => {
    sendMessage(payload);
  };

  const handleNewChat = () => {
    createNewConversation();
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  return (
    <div className="widget-container">
      <Sidebar
        conversations={conversations.map(c => ({ id: c.id, title: c.title }))}
        activeConversation={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        showWelcome={showWelcome}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        onCardClick={handleCardClick}
        onQuickReplyClick={handleQuickReplyClick}
      />
    </div>
  );
}

export default App;
