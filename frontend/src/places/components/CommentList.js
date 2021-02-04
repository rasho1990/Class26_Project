import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Comment from './Comment';
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal';
import AuthContext from '../../shared/context/auth-context';
import useHttpRequest from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { FaRegComments } from 'react-icons/fa';

import './CommentList.css';

function CommentList(props) {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpRequest();

  const userId = auth.userId;
  const placeId = props.placeId;
  const [comments, setComments] = useState();

  const [updateComments, setUpdateComments] = useState(0);
  const [validInput, setValidInput] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [maxLength, setMaxLength] = useState(false);

  // gets all of the comments of a place
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/comments/${placeId}`
        );
        setComments(responseData.comments);
      } catch (err) {}
    };
    fetchComments();
  }, [sendRequest, placeId, updateComments]);

  const inputHandler = (value) => {
    setCommentInput(value);
    if (value.length > 150) {
      setMaxLength(true);
    } else {
      setMaxLength(false);
    }
  };

  const commentSubmitHandler = async (event) => {
    event.target.reset();
    event.preventDefault();
    setMaxLength(false);
    commentInput ? setValidInput(true) : setValidInput(false);
    if (validInput) {
      const commentId = uuidv4();
      const commentDate = new Date();
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/comments/newComment`,
          'POST',
          JSON.stringify({
            date: commentDate,
            userId: userId,
            placeId: placeId,
            comment: commentInput,
            commentId: commentId,
          }),
          {
            Authorization: 'Bearer ' + auth.token,
            'Content-Type': 'application/json',
          }
        ).then(() => setCommentInput(''));
        props.setButtonKey(Math.random());
      } catch (err) {}
      setUpdateComments((prevState) => {
        return prevState + 1;
      });
    }
  };

  const deleteComment = async (deletedcommentId) => {
    setComments((prevComment) =>
      prevComment.filter((comment) => comment.id !== deletedcommentId)
    );
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/comments/${deletedcommentId}/${userId}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      props.setButtonKey(Math.random());
    } catch (err) {}
  };

  const updateComment = async (id, data) => {
    data ? setValidInput(true) : setValidInput(false);
    if (validInput) {
      const commentDate = new Date();
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/comments/${id}`,
          'PATCH',
          JSON.stringify({
            date: commentDate,
            comment: data,
            userId: userId,
            placeId: placeId,
          }),
          {
            Authorization: 'Bearer ' + auth.token,
            'Content-Type': 'application/json',
          }
        );
      } catch (err) {}
      setUpdateComments((prevState) => {
        return prevState + 1;
      });
    }
  };

  return (
    <React.Fragment>
      <div className='icon'>
        <FaRegComments className='react-icons' size={60} />
      </div>

      <ErrorModal error={error} onClear={clearError} />

      {comments
        ? comments.length === 0 && (
            <p>
              <strong>No comments yet. Be the first to comment! </strong>
            </p>
          )
        : null}
      {comments &&
        comments.map((comment) => (
          <Comment
            key={comment.id}
            id={comment.id}
            deleteComment={deleteComment}
            updateComment={updateComment}
            image={comment.creator ? comment.creator.image : null}
            commentBody={comment.comment}
            userId={comment.userId}
            date={comment.date}
            creator={comment.creator}
          />
        ))}
      {isLoading && <LoadingSpinner asOverlay />}

      {!auth.isLoggedIn ? (
        <>
          <p>You must log in to write a comment.</p>
          <button
            className='bttn'
            onClick={() => {
              history.push('/auth');
            }}
          >
            Log In
          </button>
        </>
      ) : (
        <form className='formDiv' onSubmit={commentSubmitHandler}>
          <div className='form'>
            <textarea
              placeholder='type your comment here..'
              className='formInput'
              maxlength='151'
              onChange={(e) => inputHandler(e.target.value)}
            />
            {maxLength && (
              <p style={{ color: 'red' }}>Max length is 150 character.</p>
            )}
          </div>
          <button
            className='bttn'
            disabled={commentInput.length < 5}
            type='submit'
          >
            POST COMMENT
          </button>
        </form>
      )}
    </React.Fragment>
  );
}

export default CommentList;
