import React, { useState, useEffect } from 'react'

const InBrowserNotification = (props) => {
    useEffect(() => {
        setTimeout(() => {
            playNotificationSound();
        }, 1300)
    }, [])
    const playNotificationSound = () => {
        const sound = new Audio('../sounds/that-was-quick.mp3');
        sound.play();
    }
    return (
        <div className="container">
            {/* <embed hidden={true} src="../sounds/that-was-quick.mp3" id="notification"/> */}
            <div className="notificationBellContainer">    
                <i className="fa fa-bell fa-lg"/>
            </div>
            <div className="cancelAndMessageContainer">
                <div className="messageContainer">
                    <h1 className="title">{props.title}</h1>
                    <p className="message">{props.message}</p>
                </div>
                <div className="cancelContainer">
                    <i onClick={props.onExit} className="fa fa-times-circle cancelIcon"/>
                </div>
            </div>
        </div>
    )
}
export default InBrowserNotification