import React, { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import "./Post.css";
import { db } from "./firebase";
import firebase from "firebase";

function Post({ postId, currentUser, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp")
                .onSnapshot((snapshot) => {
                    setComments(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            comment: doc.data(),
                        }))
                    );
                });
        }
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: currentUser.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment("");
    };

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt={username} />
                <h3>{username}</h3>
            </div>
            {/* header -> avatar, username */}

            <img src={imageUrl} className="post__image" />
            {/* image */}

            <div className="post__text">
                <strong>{username}</strong>
                {caption}
            </div>
            {/* username + caption */}

            <div className="post__comments">
                {comments.map(({ id, comment }) => {
                    return (
                        <p key key={id}>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    );
                })}
            </div>

            {currentUser && (
                <form className="post__commentBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a Comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            )}

            {/* comments */}
        </div>
    );
}

export default Post;
