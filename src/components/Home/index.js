import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

import Header from "../Header";
import { MdVerified } from "react-icons/md";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { TbMessageCircle } from "react-icons/tb";
import { AiOutlineSend } from "react-icons/ai";

import io from "socket.io-client";

import "./index.css";

const socket = io.connect("https://post-backkend.onrender.com");

const Home = () => {
  const [isCommentsOpen, setIscommentsOpen] = useState(false);
  const [inpComment, setInpComment] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [commentsList, setCommentsList] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [renderr, setRenderr] = useState(1);
  const [selectedComment, setSelectedComment] = useState(null);

  const timeoutRef = useRef(null);

  useEffect(() => {
    getUserDetails();
    getComments();
    socket.on("db_updated", (data) => {
      setRenderr(data);
    });
  }, [commentsList, renderr]);

  const getUserDetails = async () => {
    const url = "https://post-backkend.onrender.com/user";
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
    const url = "https://post-backkend.onrender.com/comments";
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
    const url = "https://post-backkend.onrender.com/comments";
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
    if (inpComment.length !== 0) {
      await fetch(url, options);
      setInpComment("");
      socket.emit("update_db", "1");
    }
  };

  const mouseDown = (event) => {
    const id = event.currentTarget.id;
    timeoutRef.current = setTimeout(() => {
      setSelectedComment(Number(id));
    }, 500);
  };

  const mouseUp = () => {
    clearTimeout(timeoutRef.current);
  };

  const removeComment = async (event) => {
    const id = event.currentTarget.id;
    const url = "https://post-backkend.onrender.com/comments";
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentid: id }),
    };
    await fetch(url, options);
    setSelectedComment(null);
    getComments();
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
          src="https://res.cloudinary.com/dnxaaxcjv/image/upload/v1760858716/raja-sabha_xghmo3.jpg"
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
                  <li
                    onMouseDown={
                      i.userid === userDetails.id ? mouseDown : undefined
                    }
                    onMouseUp={
                      i.userid === userDetails.id ? mouseUp : undefined
                    }
                    onMouseLeave={
                      i.userid === userDetails.id ? mouseUp : undefined
                    }
                    onTouchStart={
                      i.userid === userDetails.id ? mouseDown : undefined
                    }
                    onTouchEnd={
                      i.userid === userDetails.id ? mouseUp : undefined
                    }
                    key={i.id}
                    id={i.id}
                    className={`home-comment-item ${
                      i.userid === userDetails.id &&
                      i.id === selectedComment &&
                      "clicked-to-be-removed"
                    }`}
                  >
                    <img
                      className="home-comment-profile-pic"
                      alt="comment-profile-pic"
                      src="https://res.cloudinary.com/dnxaaxcjv/image/upload/v1760812985/Screenshot_2025-10-19_001249_frlitt.png"
                    />
                    <div className="home-comment-username-cont">
                      <p className="home-comment-username">{i.username}</p>
                      <p className="home-coment-comm">{i.comment}</p>
                    </div>
                    {userDetails.id === i.userid &&
                      i.id === selectedComment && (
                        <IoClose
                          id={i.id}
                          onClick={removeComment}
                          className="home-comment-remove"
                        />
                      )}
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
