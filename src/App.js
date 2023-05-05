import React from 'react';
import Chat, { Bubble, useMessages, IconButton, toast } from '@chatui/core';
import '@chatui/core/es/styles/index.less';
import '@chatui/core/dist/index.css';
import './chatui-theme.css';
import axios from 'axios';
import Clipboard from 'clipboard';


const initialMessages = [
  {
    type: 'text',
    content: { text: '主人好，我是智能助理，你的贴心小助手~' },
    user: { avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg' },
  }
];

// 默认快捷短语，可选
const defaultQuickReplies = [
  {
    name: '新对话',
    isNew: true,
    content: 'p'
  }
];

const copy = new Clipboard('.copy-btn');
copy.on('success', e => {
  toast.success('复制成功');
});

copy.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});


export default function App() {
  // 消息列表
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);
  const msgRef = React.useRef(null);

  // 发送回调
  function handleSend(type, val) {
    if (type === 'text' && val.trim()) {
      // TODO: 发送请求
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });

      setTyping(true);

      axios.post('/chat', {
        content: val,
      })
      .then(function (response) {
        appendMsg({
          type: 'text',
          user: { avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg' },
          content: { text: response.data.txt },
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    }
  }

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item) {
    handleSend('text', item.content);
  }

  function renderMessageContent(msg) {
    const { type, content } = msg;

    // 根据消息类型来渲染
    switch (type) {
      case 'text':
        return (
          <div>
            <Bubble content={content.text} children={<IconButton size="sm" icon="copy" data-clipboard-text={content.text} className="copy-btn" />} />
          </div>
        );
      case 'image':
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      default:
        return null;
    }
  }

  function onInputFocus() {
    if (msgRef && msgRef.current) {
      msgRef.current.scrollToEnd() ;
    }
    console.log(msgRef)
  }

  return (
    <Chat
      navbar={{ title: '智能助理' }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      quickReplies={defaultQuickReplies}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
      onInputFocus={onInputFocus}
      messagesRef={msgRef}
    />
  );
}