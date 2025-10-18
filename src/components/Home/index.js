import { useState, useEffect } from "react";

import Header from "../Header";
import { MdVerified } from "react-icons/md";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { TbMessageCircle } from "react-icons/tb";
import { AiOutlineSend } from "react-icons/ai";

import io from "socket.io-client";

import "./index.css";

const socket = io.connect("http://localhost:3001");

const Home = () => {
  const [isCommentsOpen, setIscommentsOpen] = useState(false);
  const [inpComment, setInpComment] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [commentsList, setCommentsList] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [renderr, setRenderr] = useState(1);

  useEffect(() => {
    getUserDetails();
    getComments();
    socket.on("db_updated", (data) => {
      setRenderr(data);
    });
  }, [commentsList, renderr]);

  const getUserDetails = async () => {
    const url = "http://localhost:3001/user";
    const userData = { userMail: localStorage.getItem("email") };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        setUserDetails(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const getComments = async () => {
    const url = "http://localhost:3001/comments";
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      setCommentsList(data);
    }
  };

  const commentPosted = async (event) => {
    event.preventDefault();
    const url = "http://localhost:3001/comments";
    const commentDetails = {
      userid: userDetails.id,
      comment: inpComment,
      postid: 1,
      username: userDetails.username,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentDetails),
    };
    await fetch(url, options);
    setInpComment("");
    socket.emit("update_db", "1");
  };

  return (
    <>
      <Header />
      <div className="home-bg-container">
        <div className="home-profile-name-cont">
          <img
            src="https://res.cloudinary.com/dnxaaxcjv/image/upload/v1760774174/299800155_407521588152596_8124829657862300470_n._e9crrf.jpg"
            className="home-profile-image"
            alt="prabhas"
          />
          <p className="home-profile-name">actorprabhas</p>
          <MdVerified className="home-profile-tic" />
        </div>
        <img
          src="https://res.cloudinary.com/dnxaaxcjv/image/upload/v1760772305/raja-sabha_tflvya.jpg"
          alt="post"
          className="home-post"
        />
        <div className="home-icons-cont">
          <button
            type="button"
            className="home-icon-btn"
            onClick={() => setIsLiked(!isLiked)}
          >
            {isLiked ? (
              <GoHeartFill className="home-liked-icon" />
            ) : (
              <GoHeart className="home-unliked-icon" />
            )}
          </button>
          <button
            type="button"
            className="home-icon-btn"
            onClick={() => setIscommentsOpen(!isCommentsOpen)}
          >
            <TbMessageCircle className="home-comment-icon" />
          </button>
        </div>
        {isCommentsOpen && (
          <div className="home-comments-section">
            <p className="home-comments-heading">Comments</p>
            {commentsList.length !== 0 ? (
              <ul className="home-comments-list-cont">
                {commentsList.map((i) => (
                  <li key={i.id} className="home-comment-item">
                    <img
                      className="home-comment-profile-pic"
                      alt="comment-profile-pic"
                      src="https://res.cloudinary.com/dnxaaxcjv/image/upload/v1760812985/Screenshot_2025-10-19_001249_frlitt.png"
                    />
                    <div className="home-comment-username-cont">
                      <p className="home-comment-username">{i.username}</p>
                      <p className="home-coment-comm">{i.comment}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="home-no-comments">No comments yet</p>
            )}
            <form onSubmit={commentPosted} className="home-inp-cont">
              <input
                type="text"
                className="home-inp"
                placeholder="Write your comment here"
                value={inpComment}
                onChange={(event) => setInpComment(event.target.value)}
              />
              {inpComment !== "" && (
                <button type="submit" className="home-inp-send-btn">
                  <AiOutlineSend className="home-comm-send-icon" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
