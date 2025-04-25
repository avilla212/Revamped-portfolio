// Fetch and display the username
const fetchUsername = async () => {
  try {
    const response = await fetch('/api/test');
    if (!response.ok) {
      throw new Error(`Failed to fetch username: ${response.status}`);
    }

    const data = await response.json();
    if (data.username) {
      const usernameElement = document.getElementById('username');
      if (usernameElement) {
        usernameElement.textContent = data.username;
      }
      // Save username globally
      window.loggedInUsername = data.username;
    }
  } catch (error) {
    console.error(`Error fetching username: ${error.message}`);
    window.location.href = '/index.html'; // Redirect to login if error
  }
};

// Fade out welcome container on image click
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

// Setup message sending logic
const setupMessageSending = () => {

  // get reference 
  const sendButton = document.getElementById('sendButton');
  const messageInput = document.getElementById('messageInput');

  // only continue if both elements exist on the page
  if (sendButton && messageInput){
    // when the send button is clicked
    sendButton.addEventListener('click', async () => {
      // get the text the user typed
      const messageText = messageInput.value.trim();
      
      // if the input is empty
      if (messageText == ""){
        return;
      }

      try {
        // send the message to the backend
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // tell server we are sending JSON 
          },
          body: JSON.stringify({ content: messageText })
        });

        // if response is not ok
        if (!response.ok){
          throw new Error(`Failed to send ${response.status}`);
        }


        // re fetch and render message
        messageInput.value = "";
        await fetchMessages();

      } catch (error){
        alert('Uh Oh! Something went wrong.')
      }
    })
  }
}

// render message into the DOM 
const renderMessages = (messages) => {
  const container = document.getElementById('messagesContainer');
  if (!container) return;

  container.innerHTML = ""; // Clear previous messages

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


// fetch messages to display on homepage
const fetchMessages = async () => {
  try {
    const response = await fetch('/api/messages');
    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await response.json();
    renderMessages(data); // Pass fetched messages to render function
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};


// Initialize homepage logic
const initHomepage = () => {
  fetchUsername();
  fetchMessages();
  setupFadeOut();
  setupMessageSending();
};

// Run when DOM is loaded
window.addEventListener('DOMContentLoaded', initHomepage);
