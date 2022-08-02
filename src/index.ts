import AbstractShareButton from './AbstractShareButton';
import ShareButtonTwitter from './ShareButtonTwitter';
import ShareButtonFacebook from './ShareButtonFacebook';
import ShareButtonLinkedIn from './ShareButtonLinkedIn';
import ShareButtonPrint from './ShareButtonPrint';

const twitter: AbstractShareButton = new ShareButtonTwitter('.btn-twitter', "https://www.youtube.com/rodrigobranas");
twitter.bind();
const facebook: AbstractShareButton = new ShareButtonFacebook('.btn-facebook', "https://www.youtube.com/rodrigobranas");
facebook.bind();
const linkedIn: AbstractShareButton = new ShareButtonLinkedIn('.btn-linkedin', "https://www.youtube.com/rodrigobranas");
linkedIn.bind();
const print: AbstractShareButton = new ShareButtonPrint('.btn-print');
print.bind();