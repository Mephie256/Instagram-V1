const {
  onDocumentCreated,
  onDocumentDeleted,
} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.addLike = onDocumentCreated(
  "/posts/{creatorId}/userPosts/{postId}/likes/{userId}",
  (event) => {
    const { creatorId, postId } = event.params;
    console.log(
      `Like added by user: ${event.params.userId} on post: ${postId} by creator: ${creatorId}`
    );
    return db
      .collection("posts")
      .doc(creatorId)
      .collection("userPosts")
      .doc(postId)
      .update({
        likesCount: admin.firestore.FieldValue.increment(1),
      })
      .then(() => {
        console.log(`Successfully incremented like count for post: ${postId}`);
      })
      .catch((error) => {
        console.error(
          `Error incrementing like count for post: ${postId}`,
          error
        );
      });
  }
);

exports.removeLike = onDocumentDeleted(
  "/posts/{creatorId}/userPosts/{postId}/likes/{userId}",
  (event) => {
    const { creatorId, postId } = event.params;
    console.log(
      `Like removed by user: ${event.params.userId} on post: ${postId} by creator: ${creatorId}`
    );
    return db
      .collection("posts")
      .doc(creatorId)
      .collection("userPosts")
      .doc(postId)
      .update({
        likesCount: admin.firestore.FieldValue.increment(-1),
      })
      .then(() => {
        console.log(`Successfully decremented like count for post: ${postId}`);
      })
      .catch((error) => {
        console.error(
          `Error decrementing like count for post: ${postId}`,
          error
        );
      });
  }
);
