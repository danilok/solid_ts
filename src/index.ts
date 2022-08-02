import ShareButtonTwitter from './ShareButtonTwitter';
import ShareButtonFacebook from './ShareButtonFacebook';
import ShareButtonLinkedIn from './ShareButtonLinkedIn';
import ShareButtonPrint from './ShareButtonPrint';

const twitter = new ShareButtonTwitter('.btn-twitter', "https://www.youtube.com/rodrigobranas");
twitter.bind();
const facebook = new ShareButtonFacebook('.btn-facebook', "https://www.youtube.com/rodrigobranas");
facebook.bind();
const linkedIn = new ShareButtonLinkedIn('.btn-linkedin', "https://www.youtube.com/rodrigobranas");
linkedIn.bind();
const print = new ShareButtonPrint('.btn-print', "https://www.youtube.com/rodrigobranas");
print.bind();