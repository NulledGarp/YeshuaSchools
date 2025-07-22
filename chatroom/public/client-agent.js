
const socket = io();
let currentUser = null;
let typingTimeout;

    const userList = document.getElementById("userList");
    const chatWindow = document.getElementById("chatWindow");
    const messageInput = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");

    // Load connected users
    socket.on("user_list", users => {
      userList.innerHTML = '<h2 class="font-bold text-xl text-red-700 mb-4">Users</h2>';
      users.forEach(user => {
        const btn = document.createElement("button");
        btn.className = "block w-full text-left p-2 rounded hover:bg-yellow-200";
        btn.innerText = user;
        btn.onclick = () => {
          currentUser = user;
          chatWindow.innerHTML = "";
          socket.emit("load_chat", user);
        };
        userList.appendChild(btn);
      });
    });

    // Display sent and received messages
    function appendMessage(sender, msg, time = new Date().toLocaleTimeString()) {
      const div = document.createElement("div");
      div.className = sender === "You" ? "text-right" : "text-left";
      div.innerHTML = `<div class="inline-block bg-white shadow px-3 py-2 rounded-lg">
        <strong class="text-red-700">${sender}</strong>: ${msg}
        <span class="block text-xs text-gray-500">${time}</span>
      </div>`;
      chatWindow.appendChild(div);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Handle incoming message from user
    socket.on("user_message", ({ user, message, time }) => {
      if (user === currentUser) {
        appendMessage(user, message, time);
      }
    });

    // Handle agent's own message being echoed back
    socket.on("agent_message_sent", ({ message, time }) => {
      appendMessage("You", message, time);
    });

    sendBtn.onclick = () => {
      const msg = messageInput.value.trim();
      if (!msg || !currentUser) return;
      socket.emit("agent_message", { to: currentUser, message: msg });
      messageInput.value = "";
      socket.emit("agent_stop_typing", currentUser);
    };

    // Typing indicator (debounced)
    messageInput.addEventListener("input", () => {
      if (!currentUser) return;
      if (messageInput.value.trim()) {
        socket.emit("agent_typing", currentUser);
        resetTypingTimeout();
      } else {
        socket.emit("agent_stop_typing", currentUser);
      }
    });

    function resetTypingTimeout() {
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socket.emit("agent_stop_typing", currentUser);
      }, 2000);
    }

    // Show chat history
    socket.on("chat_history", (history) => {
      chatWindow.innerHTML = "";
      history.forEach(msg => {
        const sender = msg.sender === "agent" ? "You" : msg.sender;
        appendMessage(sender, msg.message, msg.timestamp);
      });
    });
