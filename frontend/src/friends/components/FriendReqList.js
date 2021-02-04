import React from 'react';
import FriendItem from './FriendItem'
import './friendItem.css';

const FriendReqList = (props) => {
    return (
        <React.Fragment>
            <ul className="card_list">
                {props.items.map((friend) => {

                    return (
                        <FriendItem
                            key={friend.id}
                            id={friend.id}
                            name={friend.name}
                            image={friend.image}
                            bell={props.bell}
                        />
                    );
                })}
            </ul>
        </React.Fragment>
    );
};
export default FriendReqList;