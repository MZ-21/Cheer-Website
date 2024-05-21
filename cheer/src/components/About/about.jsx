import React from "react";
import banner from "./banner.png";
import './about.css';

import olliLogo from "./logo.png";
import cheerConnections from "./cheerconnections.png";
import cheerGroup from "./cheergroup.png";
import cheerWorks from "./cheerworks.png";

const App = () => {



return (
    <main>
        <div className="header-container">
            <div class="image-container">
                <img src={banner} alt="banner" style={{float: 'right' }}/>
                <div class="overlay-text">About Us</div>
            </div>
        </div>
        <div className="about-container">
            <div className="olli-container">
                <img src={olliLogo} alt="olli" style={{ width: '300px', height: 'auto'}}/>
                <div class="text-container">
                    <div class="olli-description">OLLI is a registered not-for-profit caregiver driven company with four areas of focus: Cheer Group; Cheer Works; Cheer Connections; and, Cheer Living.</div>
                    <div class="visionstatement-container">We are striving to be a community of inclusion and a circle of friendship that supports and enhances the lives of our loved ones with intellectual disabilities as well as the whole family.</div>
                </div>
            </div>
        </div>
        <h1 class="sub-title">Our Subsidiaries</h1>
        <div className="catalog-container">
            <div className="cheerconnections-container">
                <img src={cheerConnections} alt="cheerconnections" style={{ width: '300px', height: 'auto'}}/>
                <div class="cheerconnections-description">Caregiver social and support group, creators and administrators of all things C.H.E.E.R</div>
            </div>
            <div className="cheergroup-container">
                <img src={cheerGroup} alt="cheergroup" style={{ width: '300px', height: 'auto'}}/>
                <div class="cheergroup-description">Social, recreation, leisure, and friendship program for young adults with intellectual disabilities.</div>
            </div>
            <div className="cheerworks-container">
                <img src={cheerWorks} alt="cheerworks" style={{ width: '300px', height: 'auto'}}/>
                <div class="cheerworks-description">Assisted employment for CHEER Group members providing an opportunity to gain job skills and income. There are many different jobs available considering differing abilities.</div>
            </div>
        </div>

    </main>
)
}

export default App;