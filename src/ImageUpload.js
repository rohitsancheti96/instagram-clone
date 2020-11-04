import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { db, storage } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");

    const handleChange = (e) => {
        if (e.target.files[0]) setImage(e.target.files[0]);
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                //alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        //post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption,
                            imageUrl: url,
                            username,
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        );
    };

    return (
        <div className="imageupload">
            <input
                className="imageupload__caption"
                placeholder="Enter a caption..."
                onChange={(e) => setCaption(e.target.value)}
                type="text"
                value={caption}
            />
            <progress
                className="imageupload__progress"
                value={progress}
                max="100"
            />
            <input type="file" onChange={handleChange} />
            <Button disabled={!caption} onClick={handleUpload}>
                Post
            </Button>
        </div>
    );
}

export default ImageUpload;
