import React, { useState, useContext, Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../../shared/components/UIElements/StarRating';
import AuthContext from './../../shared/context/auth-context';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from 'react-share';
import { FaRegCommentDots, FaRegMap, FaEdit, FaTrashAlt } from 'react-icons/fa';
import ShareIcon from '@material-ui/icons/Share';
import { GiFullWoodBucketHandle } from 'react-icons/gi';
import Card from './../../shared/components/UIElements/Card';
import LoadingSpinner from './../../shared/components/UIElements/LoadingSpinner';
import Button from './../../shared/components/FormElements/Button';
import Modal from './../../shared/components/UIElements/Modal/Modal';
import ErrorModal from './../../shared/components/UIElements/Modal/ErrorModal';
import Map from './../../shared/components/UIElements/Map';
import useHttpRequest from './../../shared/hooks/http-hook';
import CommentList from './CommentList';
import { Tooltip, Zoom, withStyles } from '@material-ui/core';
import './PlaceItem.css';

const PlaceItem = ({
  image,
  title,
  description,
  address,
  placeId,
  coordinates,
  onDeletePlace,
  creatorId,
  creatorName,
  isAddedToBucketList = false,
  rate,
}) => {
  const { isLoggedIn, userId, token } = useContext(AuthContext);
  const { isLoading, error, clearError, sendRequest } = useHttpRequest();
  const [showMap, setShowMap] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showBucketModal, setShowBucketModal] = useState(false);
  const [bucketItemAdded, setBucketItemAdded] = useState(isAddedToBucketList);
  const [showComments, setShowComments] = useState(false);
  const [buttonKey, setButtonKey] = useState(Math.random());
  const [updatedComments, setUpdatedComments] = useState([]);
  const [showIcons, setShowIcons] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const openDeleteHandler = () => setShowDelete(true);
  const closeDeleteHandler = () => setShowDelete(false);
  const openModalHandler = () => setShowBucketModal(true);
  const closeBucketModalHandler = () => setShowBucketModal(false);
  const openComments = () => setShowComments(true);
  const closeComments = () => setShowComments(false);

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 14,
    },
  }))(Tooltip);

  const deletePlaceHandler = async (placeId) => {
    const url = `/api/places/${placeId}`;

    const body = {};
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const request = {
      method: 'DELETE',
      body,
      headers,
    };

    try {
      await sendRequest(url, request.method, request.body, request.headers);
    } catch (err) {
      console.log('Error while deleting place!', err);
    }
    setShowDelete(false);
    onDeletePlace(placeId);
  };

  const addBucketList = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/bucketlist/${placeId}`,
        'PATCH',
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setShowBucketModal(false);
      setBucketItemAdded(true);
    } catch (error) {
      setShowBucketModal(false);
      console.log('error');
    }
  };

  const showShareIcons = () => {
    setShowIcons(true);
  };

  const closeShareIcons = () => {
    setShowIcons(false);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/comments/${placeId}`
        );
        setUpdatedComments(responseData.comments);
      } catch (err) {}
    };
    fetchComments();
  }, [sendRequest, placeId, buttonKey]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className='map-container'>
          <Map center={coordinates} zoom={14} />
        </div>
      </Modal>
      <Modal
        className='commentsModal'
        show={showComments}
        onCancel={closeComments}
        header={'Comments'}
        headerClass={'comments-header'}
      >
        <div>
          <CommentList
            setButtonKey={setButtonKey}
            placeUrl={image}
            placeId={placeId}
            className='comment-list'
          />
        </div>
      </Modal>
      <Modal
        show={showDelete}
        onCancel={closeDeleteHandler}
        header={'Are you sure?'}
        footerClass='place-item__modal-actions'
        footer={
          <React.Fragment>
            <Button onClick={closeDeleteHandler} inverse>
              CANCEL
            </Button>
            <Button onClick={() => deletePlaceHandler(placeId)} danger>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you really want to delete this place? This action is IRREVERSIBLE!
        </p>
      </Modal>
      <Modal
        className='shareModal'
        show={showIcons}
        onCancel={closeShareIcons}
        header={'Share with your friends on social media!'}
        contentClass='place-item__modal-content'
        footer={
          <React.Fragment>
            <Button onClick={closeShareIcons} inverse>
              Cancel
            </Button>
          </React.Fragment>
        }
      >
        <div>
          <FacebookShareButton
            className='icons'
            url={`${process.env.REACT_APP_ASSETS_URL}/places/${placeId}/details`}
            imageURL={`${process.env.REACT_APP_ASSETS_URL}/${image}`}
            quote={title}
            hashtag={'Hack Your Places'}
          >
            <FacebookIcon round size={40} />
          </FacebookShareButton>
          <LinkedinShareButton
            className='icons'
            url={`${process.env.REACT_APP_ASSETS_URL}/places/${placeId}/details`}
            media={`${process.env.REACT_APP_ASSETS_URL}/${image}`}
            title={title}
          >
            <LinkedinIcon round size={40} />
          </LinkedinShareButton>
          <TwitterShareButton
            className='icons'
            url={`${process.env.REACT_APP_ASSETS_URL}/places/${placeId}/details`}
            media={`${process.env.REACT_APP_ASSETS_URL}/${image}`}
            title={title}
            hashtags={['Shareplace']}
          >
            <TwitterIcon round size={40} />
          </TwitterShareButton>
        </div>
      </Modal>
      <li className='place-item' key={creatorId}>
        <Card className='place-item__content'>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className='place-item__image'>
            <Link to={`/places/${placeId}/details`}>
              <img src={image} alt={title} />
            </Link>
          </div>
          <div className='place-item__info'>
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
            <StarRating
              placeId={placeId}
              raterIds={rate.raterIds}
              raterRates={rate.raterRates}
              averageRating={rate.averageRating}
              creatorRate={rate.creatorRate}
              creatorId={creatorId}
            />
          </div>
          {creatorName !== null && creatorName.name ? (
            <Link to={`/${creatorName.id}/places`} style={{ color: 'gray' }}>
              <div style={{ margin: '20px' }}>
                <h6>Created By: {creatorName.name}</h6>
              </div>
            </Link>
          ) : (
            ''
          )}
          <div className='place-item__actions'>
            <LightTooltip TransitionComponent={Zoom} title='Show Map'>
              <span>
                <Button onClick={openMapHandler}>
                  <FaRegMap size={24} />
                </Button>
              </span>
            </LightTooltip>
            <LightTooltip TransitionComponent={Zoom} title='Add Comment'>
              <span>
                <Button onClick={openComments} key={buttonKey}>
                  <FaRegCommentDots size={24} /> ({updatedComments.length})
                </Button>
              </span>
            </LightTooltip>
            {isLoggedIn && (
              <Fragment>
                {creatorId === userId && (
                  <LightTooltip TransitionComponent={Zoom} title='Edit'>
                    <span>
                      <Button to={`/places/${placeId}`}>
                        <FaEdit size={24} />
                      </Button>
                    </span>
                  </LightTooltip>
                )}
                {creatorId === userId && (
                  <LightTooltip TransitionComponent={Zoom} title='Delete'>
                    <span>
                      <Button onClick={openDeleteHandler} danger>
                        <FaTrashAlt size={24} />
                      </Button>
                    </span>
                  </LightTooltip>
                )}
              </Fragment>
            )}
            {!bucketItemAdded ? (
              userId !== creatorId &&
              isLoggedIn && (
                <LightTooltip
                  TransitionComponent={Zoom}
                  title='Add to Your Bucket List'
                >
                  <span>
                    <Button onClick={openModalHandler}>
                      <GiFullWoodBucketHandle size={24} />
                    </Button>
                  </span>
                </LightTooltip>
              )
            ) : (
              <h3>In your Bucket List</h3>
            )}
            <LightTooltip TransitionComponent={Zoom} title='Share'>
              <div className='place-share'>
                <ShareIcon
                  onClick={showShareIcons}
                  fontSize='medium'
                  className='ShareIcon'
                ></ShareIcon>
              </div>
            </LightTooltip>
            <Modal
              show={showBucketModal}
              onCancel={closeBucketModalHandler}
              header={'Bucket List'}
              footerClass='bucket-item__modal-actions'
              footer={
                <React.Fragment>
                  <Button onClick={closeBucketModalHandler} inverse>
                    CANCEL
                  </Button>
                  <Button onClick={addBucketList} danger>
                    ADD
                  </Button>
                </React.Fragment>
              }
            >
              <p>Do you want to add {title} to your Bucket List?</p>
            </Modal>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
