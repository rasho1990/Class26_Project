import React, { Fragment } from "react";
import '../../places/components/PlaceList.css'
import Card from '../../shared/components/UIElements/Card'
import 'semantic-ui-css/semantic.min.css'
import FriendFeedUI from  './FriendFeedUI'
import PlacesFeedUI from './PlacesFeedUI'
import { Icon } from "semantic-ui-react";
import './newsfeedlist.css'
const NewsFeedList = (props) => {
    const { newsfeed,name } = props
   
    const sortedNewsByDate = newsfeed.sort((a, b) => (new Date(b.date + "," + b.time) - new Date(a.date + "," + a.time)))
     
    return (
        <Fragment>
        
       <ul className='place-list'>
       {newsfeed.length===0 && <Card><h1 style={{color:'black'}}>Welcome Our New Member  <Icon name='like' color="red" /> {name}  <Icon name='like' color="red" /> </h1></Card>}
            { sortedNewsByDate.map(news => {
                if (news.type === "Friends") {
                    return <Card key={news.userId} className="newsfeed"><FriendFeedUI news={news} /></Card>
                }
                else if (news.type === "Add New Place") {
                    return <Card key={news.place} className="newsfeed"> <PlacesFeedUI news={news} /></Card>
                }
            }) }
        </ul>
        </Fragment>
        )
}


export default NewsFeedList;