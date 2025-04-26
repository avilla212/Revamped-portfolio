// Wrap everything in a DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
  const backendURL = "https://revamped-portfolio-production.up.railway.app";

  // Fetch and display the username
  const fetchUsername = async () => {
    try {
      const response = await fetch(`${backendURL}/api/test`);
      if (!response.ok) {
        throw new Error(`Failed to fetch username: ${response.status}`);
      }

      const data = await response.json();
      if (data.username) {
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
          usernameElement.textContent = data.username;
        }
        window.loggedInUsername = data.username;
      }
    } catch (error) {
      console.error(`Error fetching username: ${error.message}`);
      window.location.href = "https://revamped-portfolio-production.up.railway.app/index.html";
    }
  };

  const setupFadeOut = () => {
    const welcomeSection = document.getElementById('welcome-container');
    const image = document.querySelector('.desktop-image');

    if (image && welcomeSection) {
      image.addEventListener('click', () => {
        welcomeSection.style.transition = 'opacity 1s ease';
        welcomeSection.style.opacity = '0';

        setTimeout(() => {
          welcomeSection.style.display = 'none';
          document.getElementById('messages-page').style.display = 'flex';
        }, 1000);
      });
    }
  };

  const setupMessageSending = () => {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');

    if (sendButton && messageInput) {
      sendButton.addEventListener('click', async () => {
        const messageText = messageInput.value.trim();
        if (messageText === "") return;

        try {
          const response = await fetch(`${backendURL}/api/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: messageText })
          });

          if (!response.ok) {
            throw new Error(`Failed to send ${response.status}`);
          }

          messageInput.value = "";
          await fetchMessages();

        } catch (error) {
          alert('Uh Oh! Something went wrong.');
        }
      });
    }
  };

  const renderMessages = (messages) => {
    const container = document.getElementById('messagesContainer');
    if (!container) return;

    container.innerHTML = "";

    messages.forEach(msg => {
      const messageBubble = document.createElement('div');
      messageBubble.classList.add('message-bubble');

      if (msg.sender === window.loggedInUsername) {
        messageBubble.classList.add('left-message');
      } else {
        messageBubble.classList.add('right-message');
      }

      messageBubble.innerHTML = `
        <strong>${msg.sender}</strong><br>
        <span>${msg.content}</span><br>
        <small>${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
      `;

      container.appendChild(messageBubble);
    });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${backendURL}/api/messages`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      renderMessages(data);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  const initHomepage = () => {
    fetchUsername();
    fetchMessages();
    setupFadeOut();
    setupMessageSending();
  };

  initHomepage();
});
