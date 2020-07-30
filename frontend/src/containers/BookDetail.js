import React, { useState, useEffect } from 'react';
import {Row,Col,Typography,Card ,Modal, Comment, Avatar, Empty , List, Rate } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import BookCover from '..//images/book_cover.jpg';
//import axios from 'axios';
import { connect } from 'react-redux';
import apiCollections, { apiReviews, apiAccount, apiContains } from '../services/utilities/API';
import { createPortal } from 'react-dom';

function BookDetail(props){

    const {Title, Text} = Typography

    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState();
    const [readCount, setReadCount] = useState(0);
    const [author, setAuthor]=useState();
    const [userIdMap, setUserIdMap] = useState(new Map());

    useEffect(() => {
      getReviews();
      getFinishedCollections();
      //getAuthor();
    }, [props.id]);

    useEffect(() => {
      /*console.log("WE UP IN THIS")
      console.log(props.book_title)
      console.log(reviews)
      console.log(reviews.length)*/
      getUsers();
    }, [reviews]);

    /*const getAuthor = () => {
      apiAuthor.getSingle(props.id)
      .then(res => {

      })
    } */

    const getFinishedCollections = () => {
      setReadCount(0);
      var finished;
      var containedIn;
      apiCollections.getAll()
      .then(res => {
          finished = res.data.filter(collection => {
          if(collection.collection_type === "Finished") {
              return collection;
          } else {
              return null;
          }
        })
        apiContains.getAll()
        .then(res => {
          containedIn = res.data.filter(contain => {
          if(contain.book === props.id) {
              return contain;
          } else {
              return null;
          }
          })
          for(var finishedCol of finished){
            for(var containsBook of containedIn){
              if(finishedCol.id === containsBook.collection){
                setReadCount(readCount => readCount + 1);
              }
            }
          }
        })
      })
    }

    const updateMap = (k,v) => {
      setUserIdMap(userIdMap.set(k,v));
    }

    const getReviews = () => {
      apiReviews.getAll()
      .then(res => {
          var filtered = res.data.filter(review => {
              if(parseInt(props.id) === review.book && parseInt(props.user_id) !== review.user) {
                  return review;
              } else {
                  return null;
              }
          })
          var doubleFiltered = res.data.find(review => {
            if(parseInt(props.id) === review.book && parseInt(props.user_id) === review.user) {
                return review;
            } else {
                return null;
            }
          })
          setReviews(filtered);
          setUserReview(doubleFiltered);
      }).catch(err => {
          console.log(err);
      })
    }

    const getUsers = () => {
      apiAccount.getAll()
      .then(res =>{
        var users;
        for (var review of reviews){
          users = res.data.find(account =>{
            if(review.user = account.id){
              /*console.log("Review: " + review.review)
              console.log("Username: " + account.username)*/
              updateMap(review.user,account.username)
              //console.log(userIdMap)
              return account;
            }
            else{
              return null;
            }
          })
        }
      })
    }

    const handleCancel = () => {
      props.updateModalVisible(!props.visible);
    };
    return(
      <div>
        <Modal
          title={null}
          visible={props.visible}
          footer={false}
          onCancel={handleCancel}
          mask={true}
          maskClosable={true}
          maskStyle ={{marginLeft:200, marginTop:60}}
          style ={{marginLeft:200,marginTop:-40}}
          bodyStyle={{height: 882}}
          width={1703}
        >
          <Row gutter={16}>
          <Col span={6}>
            <Card 
              style={{ width: 400, height: 400, background: '#cfcdc6'}}
              cover={<img alt="example" src={props.book_thumbnail} />}
            />
          </Col>
          <Col offset={1} span={8}>
          <Title style={{ textAlign : "center", fontFamily:"Book Antiqua,Georgia,Times New Roman,serif" }}>
              {props.book_title}
          </Title>
          <p><b>Synopsis:</b> {props.book_synopsis}</p>
          <p><b>Publisher:</b> {props.book_publisher}</p>
          <p><b>Date Published:</b> {props.publication_date}</p>
          <p><b>Genre:</b> {props.genre}</p>
          <p><b>Average Rating:</b> {props.averagerating}</p>
          <p><b>Read Count:</b> {readCount}</p>
          </Col>
          <Col span={9}>
            <Title level={4}>Your Review</Title>
            {userReview ? <Comment
              //actions={actions}
            author={<Rate disabled value={userReview.rating}/>}
              avatar={
                <Avatar
                  src={BookCover}
                  alt="Han Solo"
                />
              }
            content={
              <p>
                {userReview.review}
              </p>
            }
            /> :
            <Empty description = "You do not have a review yet">
            </Empty>
          }
            <Title level={4}>Other Reviews</Title>
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                showSizeChanger : false,
                total : reviews.length,
                pageSize : 5,
                defaultCurrent: 1,
              }}
              dataSource={reviews}
              renderItem={item => (
              <List.Item
                key={item}
                //actions={[
                  //<IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />
                //]}
                >
                <Comment
              //actions={actions}
              author={<p><b>{/*(()=>userIdMap.get(*/item.user/*))*/}</b><Rate disabled value={item.rating}/></p>}
              avatar={
                  <Avatar
                    src={BookCover}
                    alt="Han Solo"
                  />
                }
              content={item.review}
              datetime={item.date}
                />
              </List.Item>
              )}
          />
          </Col>
          </Row>
        </Modal>
      </div>
    )
}

const mapStateToProps = state => {
  return {
      user_id: state.user_id,
  }
}

export default connect(mapStateToProps)(BookDetail);