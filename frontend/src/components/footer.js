import footerCss from './footer.module.css';

import Gstore from '../assets/icons/playstore.png';
import Appstore from '../assets/icons/appstore.png';
import indianFlag from '../assets/images/indiaflag.png';

import Facebook from '../assets/images/facebook.png';
import Twitter from '../assets/images/twitter.png';
import Instagram from '../assets/images/instagram.png';
import Youtube from '../assets/images/youtube.png';

const Footer = () => {
    return (
        <div className={`${footerCss.footer} ${footerCss.gradientBackground}`}>
            <div className={footerCss.innerFooter}>
                {/* Section 1: Logo and Language/Location Filters */}
                <div className={footerCss.sec1}>
                    <div className={footerCss.logoBox}>Bitezoid</div> {/* App Name */}
                    <div className={footerCss.filters}>
                        <div className={footerCss.filterBox}>
                            <span>
                                <img className={footerCss.icon} src={indianFlag} alt="India flag" />
                            </span>
                            <span>India</span>
                            <span className={footerCss.arrow}>&#709;</span>
                        </div>
                        <div className={footerCss.filterBox}>
                            <span>🌐 English</span>
                            <span className={footerCss.arrow}>&#709;</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Footer Links */}
                <div className={footerCss.sec2}>
                    <div className={[footerCss.box1, footerCss.box].join(' ')}>
                        <div className={footerCss.boxTtl}>ABOUT BITEZOID</div>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Who We Are</a>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Blog</a>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Work With Us</a>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Investor Relations</a>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Report Fraud</a>
                    </div>

                    <div className={[footerCss.box2, footerCss.box].join(' ')}>
                        <div className={footerCss.boxTtl}>BITEVERSE</div>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Bitezoid</a>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Feeding India</a>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Hyperpure</a>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>BiteLand</a>
                    </div>

                    <div className={[footerCss.box3, footerCss.box].join(' ')}>
                        <div className={footerCss.boxTtl}>FOR RESTAURANTS</div>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Partner With Us</a>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Apps For You</a>

                        <div className={footerCss.boxTtl}>FOR ENTERPRISES</div>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Bitezoid For Work</a>
                    </div>

                    <div className={[footerCss.box4, footerCss.box].join(' ')}>
                        <div className={footerCss.boxTtl}>LEARN MORE</div>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Privacy</a>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Security</a>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Terms</a>
                        <a href="#" className={`${footerCss.boxOpt} ${footerCss.linkHoverEffect}`}>Sitemap</a>
                    </div>

                    <div className={[footerCss.box5, footerCss.box].join(' ')}>
                        <div className={footerCss.boxTtl}>SOCIAL LINKS</div>
                        <div className={footerCss.socialImgs}>
                            <a href="#" className={footerCss.socialImgAnchore}>
                                <img className={footerCss.socialImg} src={Facebook} alt="Facebook" />
                            </a>
                            <a href="#" className={footerCss.socialImgAnchore}>
                                <img className={footerCss.socialImg} src={Instagram} alt="Instagram" />
                            </a>
                            <a href="#" className={footerCss.socialImgAnchore}>
                                <img className={footerCss.socialImg} src={Twitter} alt="Twitter" />
                            </a>
                            <a href="#" className={footerCss.socialImgAnchore}>
                                <img className={footerCss.socialImg} src={Youtube} alt="YouTube" />
                            </a>
                        </div>
                        <a href="#" className={footerCss.app}>
                            <img className={footerCss.appImg} src={Gstore} alt="Google Play Store" />
                        </a>
                        <a href="#" className={footerCss.app}>
                            <img className={footerCss.appImg} src={Appstore} alt="Apple App Store" />
                        </a>
                    </div>
                </div>

                <hr className={footerCss.breakLine} />

                {/* Footer Disclaimer */}
                <div className={footerCss.sec3}>
                    By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy,
                    and Content Policies. All trademarks are properties of their respective owners. 
                    2008-2025 © Bitezoid™ Ltd. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Footer;
