document.addEventListener("DOMContentLoaded", () => {
  let data;

  // Load comments from localStorage if available
  if (localStorage.getItem("comments")) {
    data = JSON.parse(localStorage.getItem("comments"));
  } else {
    fetch("data.json")
      .then((response) => response.json())
      .then((jsonData) => {
        data = jsonData;
        localStorage.setItem("comments", JSON.stringify(data));
        renderComments(data);
      });
  }

  // Render comments
  if (data) {
    renderComments(data);
  }

  document.addEventListener("click", handleButtonClick);
});

function renderComments(data) {
  const commentsContainer = document.getElementById("comments-container");
  commentsContainer.innerHTML = ""; // Clear existing content

  data.comments.forEach((comment) => {
    commentsContainer.appendChild(createCommentElement(comment));
    comment.replies.forEach((reply) => {
      commentsContainer.appendChild(createReplyElement(reply));
    });
  });

  // Add comment input box at the end
  commentsContainer.appendChild(createCommentInputBox());
}

function createCommentElement(comment) {
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("comment");

  commentDiv.innerHTML = `
    <div class="user">
      <img src="${comment.user.image.png}" alt="${comment.user.username}">
      <strong>${comment.user.username}</strong> • ${comment.createdAt}
    </div>
    <p>${comment.content}</p>
    <div class="actions">
      <div class="score">
        <button class="upvote">+</button>
        <span>${comment.score}</span>
        <button class="downvote">-</button>
      </div>
      <button class="reply" data-id="${comment.id}">Reply</button>
    </div>
  `;

  return commentDiv;
}

function createReplyElement(reply) {
  const replyDiv = document.createElement("div");
  replyDiv.classList.add("reply");

  replyDiv.innerHTML = `
    <div class="user">
      <img src="${reply.user.image.png}" alt="${reply.user.username}">
      <strong>${reply.user.username}</strong> • ${reply.createdAt} • replying to ${reply.replyingTo}
    </div>
    <p>${reply.content}</p>
    <div class="actions">
      <div class="score">
        <button class="upvote">+</button>
        <span>${reply.score}</span>
        <button class="downvote">-</button>
      </div>
      <button class="reply" data-id="${reply.id}">Reply</button>
    </div>
  `;

  return replyDiv;
}

function createCommentInputBox() {
  const commentInputDiv = document.createElement("div");
  commentInputDiv.classList.add("comment-input");

  commentInputDiv.innerHTML = `
    <textarea id="new-comment-content" placeholder="Add a comment..."></textarea>
    <button id="send-comment">Send</button>
  `;

  return commentInputDiv;
}

function handleButtonClick(event) {
  if (event.target.classList.contains("upvote")) {
    const scoreSpan = event.target.nextElementSibling;
    scoreSpan.textContent = parseInt(scoreSpan.textContent) + 1;
  } else if (event.target.classList.contains("downvote")) {
    const scoreSpan = event.target.previousElementSibling;
    scoreSpan.textContent = parseInt(scoreSpan.textContent) - 1;
  } else if (event.target.id === "send-comment") {
    const newCommentContent = document.getElementById(
      "new-comment-content"
    ).value;
    if (newCommentContent.trim() !== "") {
      addNewComment(newCommentContent);
    }
  } else if (event.target.classList.contains("reply")) {
    const commentId = event.target.getAttribute("data-id");
    addReplyInputBox(commentId);
  }
}

function addNewComment(content) {
  const data = JSON.parse(localStorage.getItem("comments"));
  const newComment = {
    id: Date.now(),
    content: content,
    createdAt: "Just now",
    score: 0,
    user: data.currentUser,
    replies: [],
  };
  data.comments.push(newComment);
  localStorage.setItem("comments", JSON.stringify(data));
  renderComments(data);
}

function addReplyInputBox(commentId) {
  const commentDiv = document
    .querySelector(`button[data-id="${commentId}"]`)
    .closest(".comment, .reply");
  const replyInputBox = document.createElement("div");
  replyInputBox.classList.add("reply-input");

  replyInputBox.innerHTML = `
    <textarea class="reply-content" placeholder="Add a reply..."></textarea>
    <button class="send-reply" data-id="${commentId}">Send</button>
  `;

  commentDiv.appendChild(replyInputBox);

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("send-reply")) {
      const replyContent = event.target.previousElementSibling.value;
      if (replyContent.trim() !== "") {
        addNewReply(commentId, replyContent);
      }
    }
  });
}

function addNewReply(commentId, content) {
  const data = JSON.parse(localStorage.getItem("comments"));
  const newReply = {
    id: Date.now(),
    content: content,
    createdAt: "Just now",
    score: 0,
    replyingTo: data.comments.find(
      (comment) => comment.id === parseInt(commentId)
    ).user.username,
    user: data.currentUser,
  };
  const comment = data.comments.find(
    (comment) => comment.id === parseInt(commentId)
  );
  comment.replies.push(newReply);
  localStorage.setItem("comments", JSON.stringify(data));
  renderComments(data);
}
