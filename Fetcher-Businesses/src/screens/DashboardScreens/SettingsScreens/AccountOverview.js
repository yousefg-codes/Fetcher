import React, { useState, useEffect } from 'react'
import FirebaseFunctions from '../../../config/FirebaseFunctions'
import { FiHome, FiBell, FiLock, FiUnlock, FiAlignCenter, FiCreditCard, Fi } from 'react-icons/fi'
import { IoNewspaperOutline , IoAppsOutline, IoPersonCircleOutline} from 'react-icons/io5'
import GlobalStateHandler from '../../../config/GlobalStateHandler'

const AccountOverview = (props) => {
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
                <FiHome className="settingsScreensTitleIcon" fontSize="200%"/>
                Account Overview
            </div>
            <div style={{backgroundImage: 'url('+props.imageURL+')'}} className="accountOverviewImage"/>
            <div className="accountInfoOverview">
                Profile Info:
                <div className="underlinedAccountInfo">
                    <text className="accountOverviewInfoTitle">
                        Business Name
                    </text>
                    <text className="indentedAccountOverviewInfo">
                        {GlobalStateHandler.businessData.businessName}
                    </text>
                </div>
                <div className="underlinedAccountInfo">
                    <text className="accountOverviewInfoTitle">
                        Owner Email
                    </text>
                    <text className="indentedAccountOverviewInfo">
                        {makeInvisbleStr()}
                        {GlobalStateHandler.businessData.ownerEmail.substring(GlobalStateHandler.businessData.ownerEmail.indexOf('@')-2)}
                    </text>
                </div>
                <div className="underlinedAccountInfo">
                    <text className="accountOverviewInfoTitle">
                        Owner Phone Number
                    </text>
                    <text className="indentedAccountOverviewInfo">
                        {GlobalStateHandler.businessData.ownerPhoneNumber}
                    </text>
                </div>
                <div className="underlinedAccountInfo">
                    <text className="accountOverviewInfoTitle">
                        Business Type
                    </text>
                    <text className="indentedAccountOverviewInfo">
                        {GlobalStateHandler.businessData.businessType}
                    </text>
                </div>
                <div className="underlinedAccountInfo">
                    <text className="accountOverviewInfoTitle">
                        Business Location
                    </text>
                    <text className="indentedAccountOverviewInfo">
                        {GlobalStateHandler.businessLocation.businessLocation}
                    </text>
                </div>
                <div className="underlinedAccountInfo">
                    <text className="accountOverviewInfoTitle">
                        Location Phone Number
                    </text>
                    <text className="indentedAccountOverviewInfo">
                        {GlobalStateHandler.businessData.businessPhoneNumber}
                    </text>
                </div>
            </div>
            <button onClick={props.onEdit} className="editProfileBtn">
                Edit Profile
            </button>
            <button className="logOutBtn" onClick={async () => {
                    await FirebaseFunctions.logOut().then(() => {
                        props.history.push('/');
                    })
                }}>
                    Log Out
            </button>
        </div>
    )
}
export default AccountOverview