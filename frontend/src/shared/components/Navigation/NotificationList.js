import { GoBell } from "react-icons/go";
import React, { useState } from 'react';
import './NotificationList.css'
import { Link } from "react-router-dom";
import Card from '../UIElements/Card'
import FriendReqList from '../../../friends/components/FriendReqList'

const NotificationList = props => {
  let friendsList = props.items;

  let count = props.count

  const [open, setOpen] = useState(false);
 

  return <React.Fragment>

    <Link to="#" onClick={() => setOpen(!open)} >
     <GoBell className="bell" size={27} />
    </Link>
    {open && <div className='dropdown'> {count !== 0  ? <FriendReqList bell={props.bell} items={friendsList} /> : <Card className='notification'><h3>No New Notifcations</h3></Card>}</div>}

  </React.Fragment>
}




export default NotificationList;