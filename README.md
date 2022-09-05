# VintageBeats Web App Landing Page

## Brief Description
Thisis the landing page for VintageBeats music website, a place where you get to explore some of the most awesome music gems and everything drawing inspiration from them

## Date of Current Version
September 3, 2022

## Live Link
[Here is the live link](https://vincexiv.github.io/music-player) hosted in gh-pages. Please note that a few things may not work as the site is dependent on json-server to load and render certain files. A better way to experience the project is `git clone`ing the repo and following the steps outlined in the Set Up Instructions section.

## Live Demo
Watch the project in action through through this [demo video](https://drive.google.com/file/d/1r_18BcOU47TOF1nop4lFQK6YNIXkoDA7/view?usp=sharing)

### By
**Vincent Makokha**

## Description
This is a music website that provides more than just music. Some of the functionalities provided by the site include;

### Log In
A person needs not to sign up to enable this functionality as it is just a mock at this point. Just do the following to log in
1. Click on the "Log In" button
2. A form will appear, type any name you can think of as long as it only contains letters and numbers. Note that the log in will not be successful if spaces are included in the user name
3. Type in any password you can think of
4. Submit

Note that logging in will also fail if one of the fields are empty when submitting. You can always log in again though, that's on me ;D

Once logged in, I hope you'll notice that when you comment on songs, the new comment shows with the name you logged in tagged beneath the message. Cool, right?

### Play Songs
Not all the songs shown in the playlists are playable, here are the selected songs that you would be able to play after correctly setting up the project.
1. **Invitation To The Blues - Claudia Bettinaglio**
2. **Feels Like Rain - Buddy Guy**
3. **Don't Write Me Off - Mighty Sam McClain**
4. **I remember You - Eilen Jewell**
5. **A Virus Called The Blues - Billy Jenkins**

The reason those are the only audios that play is because they are the only ones for which an associated audio file has been provided, and an object mapping the names to the paths provided. To add new playable songs visit the following code in the **src/index.js** file and add more together with their associated paths

```
const availablePlayableSongs = {
    "Invitation To The Blues": new Audio('./assets/music/blues-jazz/Claudia Bettinaglio - Invitation To The Blues.mp3'),
    "Feels Like Rain": new Audio('./assets/music/blues-jazz/03 Feels Like Rain.mp3'),
    "Don't Write Me Off": new Audio("./assets/music/blues-jazz/Don't Write Me Off.mp3"),
    "I Remember You": new Audio('assets/music/blues-jazz/Eilen Jewell - I Remember You.mp3'),
    "A Virus Called The Blues": new Audio('assets/music/blues-rock/Billy Jenkins - A Virus Called The Blues.m4a')
}
```

### Checkout Different Playlists
There are five playlists provided in the site; **favorites, blues/jazz, blues/rock**, and **recommended for you** playlists. As at now, a user will not be able to create their own playlists. However, they can populate the **favorites** playlist by favoriting songs. This can be done by clicking on the heart icon that sits besides the song name at the center of the page. Unfavoriting the song removes it from the **favorites** playlist

### Get new songs recommended for them
The **recommended for you** section provides a list of songs that are recommended to the user based on the current songs on the **currently playing** section. That is, the song at the center of the page in huge font with audio controls beneath it. When a user clicks on a song, other songs sang by the artist of the currently playing song are fetched from the **songsterr.com** api, and three random music sample obtained from the list returned and appended to the **recommended for you** section. It is worth noting that the api does not always return a list full of songs since they sometimes do not have the songs by certain artists. Under such circumstances, the **recommended for you** section is not updated. Another thing to note is that as new songs are added to the **recommended for you** sections, same amount of songs are removed to give space in a first come first serve basis.

### favorite songs
Favoriting a song, as mentioned earlier, adds it to the **favorites** playlist. It is also persisted when the json-server is on as the file will be updated. Favoriting a song also increases the number of likes received by the song as indicated in the area below the **currently playing** song and just above the Add Comment Input form.

It is worth noting that favoriting songs obtained from the **recommended for you** section does not change its like status or like count as this functionality has not been implemented yet.

### Comment on Songs
When a user is logged in, commenting on a song will add the comment to the song with the name they logged in with as the person commenting. If they are not logged in, this comment will be tagged with the name "unknown", showing that the person making that comment is unknown.

Comments, like favoriting, is persistent when running with json-server, thus upon refreshing the browser, the comments will still show


## Built With
HTML, CSS, & JavaScript

## Prerequisites
A browser to load the file and json-server to enable certain functionalities

## Dependancies
json-server
Browser that supports functionalities such as flex-box and media queries. This project is likely to be functional with most popular browsers

## Setup Instructions
1. Clone the repository to get it locally to your computer. You can also fork the repository and get your own copy from where you can clone it and perform the rest of the processes
2. Navigate to the relevant directory and open it with your preferred editor.
3. get json-server to watch the file containing information. This is the **db.json** file, and it is located in the root directory together with the index.html file. Run the code `json-server --watch db.json` in the directory containing the db.json file
4. Open the index.html file in your preferred browser
5. Interract with the page.

## Support and Contact Details
name:	   Vincent Makokha
email:	   vincent.makokha@student.moringaschool.com

## License
MIT License

Copyright (c) 2022 VintageBeats

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.