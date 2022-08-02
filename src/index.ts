import ShareButton from './ShareButton';

const shareButton = new ShareButton("https://www.youtube.com/rodrigobranas");
shareButton.bind('.btn-twitter', 'twitter');
shareButton.bind('.btn-facebook', 'facebook');
shareButton.bind('.btn-linkedin', 'linkedin');
