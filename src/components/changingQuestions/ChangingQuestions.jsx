import React, { Component } from 'react';
import faunadb, { query as q } from "faunadb";
import { FAUNA_SECRET } from '../../constants';

var client={};

class ChangingQuestions extends React.Component {
    constructor(props) {
        super(props);
        this.questionList = ["question1-your age?","question2-do you like books","question3-do you like dogs","question4 - how much do you like to study","your name is","Send the challenge to (email)?"];
        /* this.questionList = props.questionList; */
        this.answerList = [];
        this.handleClick = this.handleClick.bind(this);
        this.state = {currentAnswer: "", currentQuestion: this.questionList[0], counter: 0};
        
        this.addFriend = this.addFriend.bind(this);
        this.getFriendByRef = this.getFriendByRef.bind(this);
        this.getFriendByName = this.getFriendByName.bind(this);
        this.getAllFriends = this.getAllFriends.bind(this);
        this.deleteOneFriend = this.deleteOneFriend.bind(this);
        this.compareTwoFriends = this.compareTwoFriends.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        }

        handleClick(e) {
          //this.answerList.add(this.state.currentAnswer);
          this.setState((state, props) => ({
              currentQuestion: this.questionList[state.counter + 1],
              counter: state.counter + 1
          }));
      }

      handleAnswer(){
        console.log("state in handleAnswers",this.state);
      }
      
    addFriend(e) {
      client = new faunadb.Client({ secret: FAUNA_SECRET });
      e.preventDefault();
      console.log('new friend');
      let name = "ion" + Math.floor(Math.random() * 1000);
      let second_name = "secondName" + Math.floor(Math.random() * 1000);
      let age = Math.floor(Math.random() * 100);
      client.query(
          q.Create(
              q.Class("friends"),
              { data: {
                  "name": `${name}`,
                  "question1": `how old is ${name} ?`,
                  "answer1": `${age}`,
                  "question2": `where ${name} lives?`,
                  "answer2": `${name}inIsrael`,
                  "email": `${name}@gmail.com`,
                  "second_name":`${second_name}`,
                  "responseRef":``
                } }))
          .then((ret) => console.log(ret))
  }


  deleteOneFriend(e) {
      client = new faunadb.Client({ secret: FAUNA_SECRET });
      e.preventDefault();
      console.log("delete one friend func by");
      client.query(q.Delete(q.Ref(q.Class("friends"), "214898311208894981"))).then((ret) => console.log(ret))
          .catch((ret) => console.log(ret))
  }

  getFriendByRef(e) {
      client = new faunadb.Client({ secret: FAUNA_SECRET});
      e.preventDefault();
      let idRef="214896159631606277";
      console.log("getFriendByRef func");
      client.query(q.Get(q.Ref(q.Class("friends"), idRef))).then((ret) => document.getElementById("getByRef").innerHTML = ret.data.name);
  }

  getFriendByName(e) {  //not working
      client = new faunadb.Client({ secret: FAUNA_SECRET});
      e.preventDefault();
      console.log("getFriendByName func");
     
      client.query(
          q.Get(
              q.Match(q.Index("a1"), "ion")))
          .then((ret) => console.log("resolve in getFriendByName",ret));
      /* client.query(
          q.Get(
              q.Match(q.Index("all_friends"), "ion")))
          .then((ret) => document.getElementById("getByName").innerHTML = ret.data); */
  }

  getAllFriends(e) {
      client = new faunadb.Client({ secret: FAUNA_SECRET });
      e.preventDefault();
      console.log("getAllFriends func");
      client.query(
          q.Paginate(q.Match(q.Index("all_friends"))))
          .then((ret) => ret.data.forEach(function (index) {
              var p = document.createElement("p");
              p.innerText = JSON.stringify(index.value);
              document.getElementById("allFriends").appendChild(p);
              console.log(index.value);
          }));
  }

  compareTwoFriends(e){
      client = new faunadb.Client({ secret: FAUNA_SECRET});
      e.preventDefault();
      console.log("compare func");
      let allRefs=[];
      let answersA={};//answers friend A
      let identical=false;
      let responseRef="214905968405774853";
      let originalRef="214896159631606277";
      let countCorrectAns=0;
      var p1 = new Promise( (resolve, reject) => {
          resolve(client.query(
              q.Paginate(q.Match(q.Index("all_friends"))))
              .then((ret) => ret.data.forEach(function (index) {
                  allRefs.push(index.id);
                 console.log(index.id);
              })).then(console.log("allRefs",allRefs)).then(function(){console.log("test",allRefs.includes(responseRef))}));
           //or
           //reject ("Can't get list of instances from the database");
      });
      p1.then(function(){if (allRefs.includes(responseRef)) {
              client.query(q.Get(q.Ref(q.Class("friends"), responseRef))).then((ret) => {answersA = ret.data;console.log(answersA)});}
      });
      console.log("number of correct answers:",countCorrectAns);
      document.getElementById("compare").innerHTML=identical;
  }

  updateRecord(e){
      client = new faunadb.Client({ secret: FAUNA_SECRET});
      e.preventDefault();
      console.log("updateRecord func");
      let idRef="214905968405774853";
      client.query(
          q.Update(
            q.Ref(q.Class("friends"), idRef),
            { data: { question1: "how young is ion?" } }))
        .then((ret) => console.log(ret))

  }




  
      render() {
          return [
            <br />,
            <button onClick={this.handleClick}>the question is</button>,
            <br />,
            <p id="question"> {this.state.currentQuestion} </p>,
              <h1>Working with fauna database</h1>,
            <br />,
            <button onClick={this.addFriend}>create one friend</button>,
            <br />,
            <h1>show posts</h1>,
            <button onClick={this.getFriendByRef}>Get friend by ref</button>,
            <p id="getByRef"></p>,
            <button onClick={this.getFriendByName}>Get friend by name</button>,
            <p id="getByName"></p>,
            <br />,
            <button onClick={this.updateRecord}>Update friend</button>,
            <p id="updateFriend"></p>,
            <br />,
            <button onClick={this.deleteOneFriend}>Delete one friend</button>,
            <p id="deleteOneFriend"></p>,
            <br />,
            <button onClick={this.getAllFriends}>Get all friends </button>,
            <div id="allFriends"></div>,
            <button onClick={this.compareTwoFriends}>Are the all answers identical?(compare friends)</button>,
            <p id="compare"></p>,
            <br />
          ];
      }



}

export default ChangingQuestions;