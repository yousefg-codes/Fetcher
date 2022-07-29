import React, { useState, useEffect } from 'react'
import FirebaseFunctions from '../../../config/FirebaseFunctions'
import { useHistory } from 'react-router-dom'
import { FiHome, FiBell, FiLock, FiUnlock, FiAlignCenter, FiCreditCard, Fi } from 'react-icons/fi'
import { IoNewspaperOutline , IoAppsOutline, IoPersonCircleOutline} from 'react-icons/io5'
import GlobalStateHandler from '../../../config/GlobalStateHandler'
import App from '../../../App'
const PasswordsScreen = (props) => {
    const [emailLengthMin2, setEmailLengthMin2] = useState(-1);
    useEffect(() => {
        setEmailLengthMin2(GlobalStateHandler.businessData.ownerEmail.substring(0, GlobalStateHandler.businessData.ownerEmail.indexOf('@')-2).length);
    }, [])
    const makeInvisbleStr = () => {
        let str = "";
        for(let i = 0; i < emailLengthMin2; i++){
            str += "*";
        }
        return str;
    }
    return (
        <div id="accOverview" className="settingsScreens">
            <div className="settingsScreensTitle">
                <FiUnlock className="settingsScreensTitleIcon" fontSize="200%"/>
                Change Password
            </div>
            <div className="weWillSendEmailTxt">
                We will send you an email..
            </div>
            <div className="sendEmailToResetPassContainer">
                <div>
                    The email will be sent to: 
                    <b>
                        {makeInvisbleStr()}
                        {GlobalStateHandler.businessData.ownerEmail.substring(GlobalStateHandler.businessData.ownerEmail.indexOf('@')-2)}
                    </b>
                </div>
                <button onClick={async () => {
                    await FirebaseFunctions.sendResetEmail(GlobalStateHandler.businessData.ownerEmail);
                    App.addNotification('Email Sent!', 'An email has been sent to '+makeInvisbleStr()+GlobalStateHandler.businessData.ownerEmail.substring(GlobalStateHandler.businessData.ownerEmail.indexOf('@')-2));
                }} className="sendEmailToResetPassBtn">
                    Send Email to Reset Password
                </button>
            </div>                  
        </div>
    )
}
export default PasswordsScreen