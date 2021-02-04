import React, { useContext, useState } from 'react';
import AuthContext from '../../shared/context/auth-context';
import Moment from 'react-moment';
import { AiTwotoneDelete } from 'react-icons/ai';
import { AiTwotoneEdit } from 'react-icons/ai';
import { AiTwotoneSave } from 'react-icons/ai';
import { GiCancel } from 'react-icons/gi';

import './Comment.css';

function Comment(props) {
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [edited, setEdited] = useState(false);
  const [maxLength, setMaxLength] = useState(false);
  const [changedText, setChangedText] = useState(false);
  const date = props.date;

  const controlAuthUser = auth.userId === props.userId ? true : false;

  const handleCommentChange = (value) => {
    setComment(value);
    if ([props.commentBody !== value]) {
      setEdited(true);
      setChangedText(true);
    } else {
      setEdited(false);
    }

    if (value.length > 150) {
      setMaxLength(true);
    } else {
      setMaxLength(false);
    }
  };

  //focus at the end of the text when user clicks edit button
  const moveCaretAtEnd = (e) => {
    let temp_value = e.target.value;
    e.target.value = '';
    e.target.value = temp_value;
  };

  return (
    <React.Fragment>
      <div className='container'>
        <div className='userDiv'>
          <img className='userImage' src={props.image} alt={'user'} />
          <p className='userName'>
            {props.creator ? props.creator.name : null}
          </p>
          <Moment className='date' format='YYYY/MM/DD HH:mm'>
            {date}
          </Moment>
        </div>
        <div className='comment'>
          <div className='commentContent'>
            {editOpen ? (
              <textarea
                className='editInput'
                type='text'
                maxlength='151'
                value={comment}
                onFocus={moveCaretAtEnd}
                onChange={(e) => handleCommentChange(e.target.value)}
              />
            ) : (
              <p className='commentBody'> {props.commentBody} </p>
            )}
            {maxLength && editOpen && (
              <p style={{ color: 'red' }}>Max length is 150 character.</p>
            )}
          </div>

          {controlAuthUser && (
            <div className='buttons'>
              <div className='dropList'>
                {editOpen ? (
                  <button
                    className={'btn-active'}
                    onClick={() => {
                      setEditOpen(false);
                      setEdited(false);
                      setOpen(!open);
                      setChangedText(false);
                    }}
                  >
                    <GiCancel size={25} />
                  </button>
                ) : (
                  <button
                    className={'btn-active'}
                    onClick={() => {
                      setEditOpen(true);
                      setOpen(!open);
                      setComment(props.commentBody);
                    }}
                  >
                    <AiTwotoneEdit size={25} />
                  </button>
                )}
              </div>

              <div className='dropList2'>
                {editOpen ? (
                  changedText ? (
                    <button
                      className={'btn-active'}
                      onClick={() => {
                        props.updateComment(props.id, comment);
                        setOpen(!open);
                        setEditOpen(false);
                        setChangedText(false);
                      }}
                    >
                      <AiTwotoneSave size={25} />
                    </button>
                  ) : null
                ) : (
                  <button
                    className={'btn-active'}
                    onClick={() => {
                      props.deleteComment(props.id);
                      setOpen(!open);
                    }}
                  >
                    <AiTwotoneDelete size={25} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
export default Comment;
