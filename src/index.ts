import ShareButtonTwitter from './ShareButtonTwitter';
import ShareButtonFacebook from './ShareButtonFacebook';
import ShareButtonLinkedIn from './ShareButtonLinkedIn';

const twitter = new ShareButtonTwitter('.btn-twitter', "https://www.youtube.com/rodrigobranas");
twitter.bind();
const facebook = new ShareButtonFacebook('.btn-facebook', "https://www.youtube.com/rodrigobranas");
facebook.bind();
const linkedIn = new ShareButtonLinkedIn('.btn-linkedin', "https://www.youtube.com/rodrigobranas");
linkedIn.bind();
