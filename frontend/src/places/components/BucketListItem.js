import React, { useState, useContext } from 'react';

import './BucketListItem.css';
import AuthContext from './../../shared/context/auth-context';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import ErrorModal from '../../shared/components/UIElements/Modal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Map from '../../shared/components/UIElements/Map';
import useHttpClient from '../../shared/hooks/http-hook';
import { FaMapMarkedAlt, FaInfoCircle, FaTrashAlt } from 'react-icons/fa';
import { Tooltip, Zoom, withStyles } from '@material-ui/core';

const BucketListItem = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token } = useContext(AuthContext);

  const openDetailsHandler = () => setShowDetails(true);
  const cloesDetailsHandler = () => setShowDetails(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 14,
    },
  }))(Tooltip);

  const deleteBucketItemHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/bucketlist/${props.placeId.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + token,
        }
      );
      props.deleteOnClick(props.placeId.id);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass='bucketList-item__modal-content'
        footerClass='bucketList-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className='map-container'>
          <Map center={props.placeId.location} zoom={15} />
        </div>
      </Modal>
      <Modal
        show={showDetails}
        onCancel={cloesDetailsHandler}
        header={`Details of ${props.title}`}
        footerClass='bucketList-item__modal-actions'
        footer={
          <React.Fragment>
            <Button onClick={cloesDetailsHandler} inverse>
              CANCEL
            </Button>
          </React.Fragment>
        }
      >
        {isLoading && <LoadingSpinner asOverlay />}
        <Card className='bucketList-item__content'>
          <div className='bucketList-item_detail__image'>
            <img src={props.image} alt={props.title} />
          </div>
          <div className='bucketList-item__info'>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <h3>{props.description}</h3>
          </div>
        </Card>
      </Modal>

      <li className='bucketList-item'>
        <Card className='bucketList-item__content_sum'>
          <div className='bucketList-item__details'>
            <div className='bucketList-item__image'>
              <img src={props.image} alt={props.title} />
            </div>
            <div className='bucketList-item__info'>
              <h2>{props.title}</h2>
              <h3>{props.address}</h3>
              <h4>Created By: {props.creator}</h4>
            </div>
          </div>
          <div className='bucketList-item__actions'>
            <LightTooltip TransitionComponent={Zoom} title='Details'>
              <span>
                <Button onClick={openDetailsHandler} inverse>
                  <FaInfoCircle size={24} />
                </Button>
              </span>
            </LightTooltip>
            <LightTooltip TransitionComponent={Zoom} title='Show Map'>
              <span>
                <Button onClick={openMapHandler} inverse>
                  <FaMapMarkedAlt size={24} />
                </Button>
              </span>
            </LightTooltip>
            <LightTooltip TransitionComponent={Zoom} title='Delete'>
              <span>
                <Button onClick={deleteBucketItemHandler} danger>
                  <FaTrashAlt size={24} />
                </Button>
              </span>
            </LightTooltip>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default BucketListItem;
