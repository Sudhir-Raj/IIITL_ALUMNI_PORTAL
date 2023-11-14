import React, { useState } from 'react';
import { Divider } from 'semantic-ui-react';
import 'src/chat.css';
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebasse-store';
firebase.initializeApp({
    apiKey: "AIzaSyC0Zgale4aObHoaRfjDL1U-uk3XrM_KNuE",
  authDomain: "iiit-alumni-network.firebaseapp.com",
  projectId: "iiit-alumni-network",
  storageBucket: "iiit-alumni-network.appspot.com",
  messagingSenderId: "174764887592",
  appId: "1:174764887592:web:a358e43e12d5dfdfd26f1d"
})
function chat(){
    const [user] = useAuthState(auth); 
    return (
        <div className="chat">
            <header className="chat-header">

            </header>
            <section>
                {user ? <ChatRoom/>:<SignIn/>}
            </section>
        </div>
    )
}

function SignIn(){
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.sigInwithPopup(provider);
    }
    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )
}
function SignOut(){
    return auth.currentUser && (
        <button onClick={()=> auth.signOut()}>Sign Out</button>
    )
}
function ChatRoom() {
    const messagesRef = firestore.collection('messages');
    const query = messagesRef,orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query,{idField:'id'});
    const [formValue,setFormValue] = useState(''); 
    const sendMessage = async(e) => {
        e.preventDefault();
        const {uid} = auth.currentUser;
        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        });

        setFormValue('');
    }
    return 
    (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key ={msg.id} message={msg}/>)};
      </div>
      <form onSubmit={sendMessage}>
        <input value ={formValue} onChange={(e)=> setFormValue(e.target.value)}/>
        <button type ="submit">sub</button>
      </form>
    </>
    )
}

function ChatMessage(props){
    const { text, uid } = props.message;
    
    const messageClass = uid === auth.currentUser.uid? 'sent': 'received';
    return (<div className={`message ${messageClass}`}>
        <p>{text}</p>
    </div>)
}