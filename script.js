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
      <button class="reply">Reply</button>
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
      <button class="reply">Reply</button>
    </div>
  `;

  return replyDiv;
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("upvote")) {
    const scoreSpan = event.target.nextElementSibling;
    scoreSpan.textContent = parseInt(scoreSpan.textContent) + 1;
  } else if (event.target.classList.contains("downvote")) {
    const scoreSpan = event.target.previousElementSibling;
    scoreSpan.textContent = parseInt(scoreSpan.textContent) - 1;
  }
});
