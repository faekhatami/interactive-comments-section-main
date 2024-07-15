document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const commentsContainer = document.getElementById("comments-container");
      data.comments.forEach((comment) => {
        commentsContainer.appendChild(createCommentElement(comment));
        comment.replies.forEach((reply) => {
          commentsContainer.appendChild(createReplyElement(reply));
        });
      });
    });
});

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
          <strong>${reply.user.usrname}</strong> • ${reply.createdAt} • replying to ${reply.replyingTo}
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
  } else if (event.target.classList.contians("downvote")) {
    const scoreSpan = event.target.previousElementSibling;
    scoreSpan.textContent = parseInt(scoreSpan.textContent) - 1;
  }
});

localStorage.setItem("comments", JSON.stringify(data));

const savedComments = JSON.parse(localStorage.getItem("comments"));
