import React, { useRef, useState } from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/analytics';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import base64url from 'base64-url';
import { toast,ToastContainer } from 'react-toastify'
firebase.initializeApp({
    apiKey: "AIzaSyD3tlw6hXxLlWAL-HWbpM-L3Jq4mokV96I",
    authDomain: "realtimechat-1afba.firebaseapp.com",
    databaseURL: "https://realtimechat-1afba-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "realtimechat-1afba",
    storageBucket: "realtimechat-1afba.appspot.com",
    messagingSenderId: "481198530416",
    appId: "1:481198530416:web:9b4c6c4f995651fc2af9b5"
});

const firestore = firebase.firestore();
const storage = firebase.storage();
const opponentName = (ownerId, ownerName, customerName, activeUserId) => {
  if(ownerId === activeUserId){
    return customerName;
  }
  return ownerName;
}
function App({ ownerId, ownerName, customerId, customerName, activeUserId }) {
  return (
    <div className="App">
      <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
/>
      <header>
        <h2>{opponentName(ownerId, ownerName, customerName, activeUserId)}</h2>
        
      </header>

      <section>
        <ChatRoom ownerId={ownerId} customerId={customerId} activeUserId={activeUserId} />
      </section>

    </div>
  );
}
function roomControl(ownerId,customerId){
  
  let roomKey = base64url.encode(`${ownerId}-${customerId}-${ownerId}-${customerId}-abc`);
  return roomKey;  
}
function ChatRoom({ ownerId,customerId, activeUserId }) {
  const dummy = useRef();
  const file = useRef();
  let roomKey = roomControl(ownerId,customerId);
  const messagesRef = firestore.collection('rooms').doc(roomKey).collection('messages');
  const query = messagesRef.orderBy('createdAt');
  
  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      sender:activeUserId
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  const sendImage = async (url) => {
    await messagesRef.add({
      text:'image',
      image:url,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      sender:activeUserId
    });
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  const uploadFile = async (e) => {
    e.preventDefault();
    let image = e.target.files[0];
    let fileName = (image.name);
    let fileSize = image.size /1024/1024;
    if(fileSize > 25 ) return toast.error('Dosya Boyutu 25Mb\'dan Küçük Olmalı', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
    let roomName = roomControl();
    let filePath = `rooms/${roomName}/files`;
    const storageRef = storage.ref(`${filePath}/${fileName}`).put(image);
    storageRef.on('state_changed',(snapshot) => {
      console.log(snapshot)
    },(err) => {
      console.warn(err);
    },() => {
      storage.ref(filePath).child(fileName).getDownloadURL().then(url => sendImage(url));
    });
  }

  return (<>
    <main>

      {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} ownerId={ownerId} customerId={customerId} activeUserId={activeUserId}/>)}
      
      <span ref={dummy}></span>
 
    </main>
    <input type="file" className={"abcdefg"} onChange={uploadFile} ref={file} />
    <form onSubmit={sendMessage}>
      <button className="fileClickButton" type="button" onClick={(e) => {
        e.preventDefault();
        file.current.click();
      }}><svg xmlns="http://www.w3.org/2000/svg" className="fileSvg" fill="none" viewBox="0 0 24 24"
      stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg></button>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Mesajınız'ı buraya yazınız" />

      <button type="submit" disabled={!formValue}>Gönder</button>

    </form>
  </>)
}
function ChatMessage({ message, ownerId, customerId, activeUserId }) {
  const { text,sender,createdAt,image } = message;

  const messageClass = sender === activeUserId ? 'sent' : 'received'; 
  let time = createdAt === null ? new Date().toLocaleTimeString().substring(0,5) : new Date(createdAt.seconds * 1000).toLocaleTimeString().substring(0, 5);
  
  return (<>
    <div className='message-container'>
      
      {messageClass === 'received' ? (<div className={`time ${messageClass}`} ><span>12:29</span></div>) : ''}
      <div className={`message ${messageClass}`}>  
        {text === 'image' ? (<p><a href={image} target="_blank">Dosyayı Görüntülemek İçin Tıklayın</a></p>) : (<p dangerouslySetInnerHTML={{__html: text.replace(/(https?:\/\/[\w\.\/]+)/, '<a target="_blank" href="$1">$1</a>')}}></p>)}
      </div>
      
      {messageClass === 'sent' ? (<div className={`time ${messageClass}`} ><span>{time}</span></div>) : ''}
    </div>

  </>)
}
export default App;
