const apiHost = 'http://localhost:3000'




document.addEventListener('DOMContentLoaded', () =>{
    let personName = 'unknown'
    const previouslyPlayedSongs = []
    

    // handle a click to the log in button in the navbar -----------------------------------------------

    const logIn = document.getElementById('log-in')
    logIn.addEventListener('click', e =>{

        if(logIn.classList.contains('not-logged-in')){
            logInForm = createLogInForm()          
            document.querySelector('section').append(logInForm)
            styleTheLogInForm(logInForm)
    
            const inputFields = logInForm.querySelectorAll('input')
            inputFields.forEach(field =>{
                styleLogInFormInputFields(field)
            })   
    
            handleActivityOnTheLogInForm(logInForm)

        }else {
            location.reload()            
        }    
    })


    function createLogInForm(){
        const logInForm = document.createElement('form')
        logInForm.innerHTML = `
        <label for="person-name">Username</label>
        <input type="text" id="person-name" name="person-name">
        <label for="person-password">Name</label>
        <input type="text" id="person-password" name="person-password">
        <input type="submit" value="submit" class="btn">`

        return logInForm
    }


    function onlyLettersAndNumbers(personName) {
        return /^[A-Za-z0-9]*$/.test(personName);
    }


    function styleTheLogInForm(logInForm){
        logInForm.style.backgroundColor = '#190204'
        logInForm.style.fontSize = '0.8rem'
        logInForm.style.color = 'white'
        logInForm.style.padding = '1rem'
        logInForm.style.opacity = '0.7'
        logInForm.style.position = 'fixed'
        logInForm.style.top = '4rem'
        logInForm.style.right = '10%'
    }


    function styleLogInFormInputFields(field){
        field.style.border = 'none'
        field.style.outline = 'none'
        field.style.padding = '0.3rem'
        field.style.marginTop = '0.5rem'
        field.style.marginBottom = '0.5rem'
    }


    function handleActivityOnTheLogInForm(logInForm){
        logInForm.addEventListener('submit', e=> {
                
            e.preventDefault();
            personName = logInForm.querySelector('#person-name').value

            if(onlyLettersAndNumbers(personName)){                
                alert(`You are logged in as ${personName}`)
                logInForm.remove()
                logIn.textContent = "Log Out"
                logIn.classList.remove('not-logged-in')
            }else{
                alert('AN ERROR OCCURRED\nname should only contain letters and numbers')
            }
        })
    }


    // getting and loading stuff from database ------------------------------------------------------------------

    getAndLoadPlaylist("favorites")//by default, the favorites button active
    let firstTimeLoadingThePage = true //This and the firstSong variable below are used to make the first song in the favorites playlist to be put on "currentlyPlaying" when the page loads

    
    function getAndLoadPlaylist(playlistName, listId = 'play-list-items'){

        if(playlistName === 'favorites'){

            fetch(`${apiHost}/bluesJazz`)
            .then(result => result.json())
            .then(bluesazzPlaylist => {
                const favoritedBluesJazzSongs = bluesazzPlaylist.filter(song => {
                    return song.liked == true;
                })

                handleDatabaseReturnValues(favoritedBluesJazzSongs, 'bluesJazz', 'play-list-items')

                fetch(`${apiHost}/bluesRock`)
                .then(result => result.json())
                .then(bluesRockPlaylist => {
                    const favoritedBluesRockSongs = bluesRockPlaylist.filter(song => {
                        return song.liked == true;
                    })

                    handleDatabaseReturnValues(favoritedBluesRockSongs, 'bluesRock', 'play-list-items')
                })
            })

        }else {
            fetch(`${apiHost}/${playlistName}`)
            .then(result => result.json())
            .then(data => {
                handleDatabaseReturnValues(data, playlistName, listId)
            })
        }
    }


    function handleDatabaseReturnValues(data, playlistName, listId){
        let firstSong;
        data.forEach(songData => {
            const song = createPlayListItem(songData, playlistName)
                           
            addSongToDom(song, listId)
            song.addEventListener('click', e => {
                moveToCurrentlyPlaying(song, playlistName)
                updateUpNext(song)
                updateBanner(songData)
                updateDomComments(playlistName, songData.id)
                loadLikes(songData.likes)
                updateLikeStatus(songData.liked)

                playSong(songData.path)
            })

            if(firstTimeLoadingThePage){
                firstSong = song
                firstTimeLoadingThePage = false 
            }
        })

        if(firstSong){
            firstSong.click() 
        }        
    }

    function updateLikeStatus(personLikesThisSong){       
        const favoriteStatus = document.getElementById('favorite')
        if(personLikesThisSong){
            favoriteStatus.classList.remove('fa-regular')
            favoriteStatus.classList.add('fa-solid')
        }else{
            favoriteStatus.classList.add('fa-regular')
            favoriteStatus.classList.remove('fa-solid')           
        }
    }
    

    function createPlayListItem(songData, playlistName='favorites'){
        const playListItem = document.createElement('li')
        playListItem.classList.add('song')
        playListItem.classList.add(playlistName)
        playListItem.id = songData.id

        playListItem.innerHTML = `<p class="song-name">${songData.songName}</p>
            <div class="song-details">
            <p class="artist-name">${songData.songArtist}</p>
        </div>`

        return playListItem
    }


    function addSongToDom(song, listId){
        document.getElementById(listId).appendChild(song)
    }

    function updateBanner(songData){
        const banner = document.getElementById('currently-playing-song-banner')
        if(songData.banner){
            banner.src = songData.banner
            banner.alt = songData.songArtist
        }else{
            banner.src = './assets/images/Buddy Guy.png'
            banner.alt = 'buddy guy with the guitar'
        }
    }


    function updateDomComments(playlistName, songId){
        fetch(`${apiHost}/${playlistName}/${songId}?_embed=${playlistName}Comments`)
        .then(result => result.json())
        .then(data => {
            const songComments = data[`${playlistName}Comments`]
            document.getElementById('comment-list').innerHTML = ''//first clear current comments being displayed

            songComments.forEach(comment => {
                addCommentToDom(comment)
            })
            loadCommentCount(songComments.length)
        })
    }

    function loadLikes(likeCount){
        document.querySelector('#like-count .count').textContent = likeCount
    }


    // Processing the comment form ------------------------------------------------------

    handleCommentForm()
    function handleCommentForm(){
        if(personName == null){
            alert('you have to log in first to comment on a song')
        }
        const commentForm = document.getElementById('add-comment-form')
        commentForm.addEventListener('submit', e => {
            e.preventDefault()

            const newComment = e.target.querySelector('textarea').value
            const currentlyPlaying = document.getElementById('currently-playing')
            const songPlaylist = currentlyPlaying.classList[0]
            const songId = parseInt(currentlyPlaying.classList[1])

            fetch(`${apiHost}/${songPlaylist}Comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(
                    {
                        [`${songPlaylist}Id`]: songId,
                        commenterName: personName,
                        content: newComment
                    }
                )
            })
            .then(result => result.json())
            .then(data => {
                addCommentToDom(data)
                addOneToCommentCount(newComment)
            })

            commentForm.reset()
        })
    }


    function addCommentToDom(commentObject){
        const newComment = document.createElement("li")
        newComment.innerHTML = `<p>${commentObject.content}</p>
                                <span class="commenter-name">${commentObject.commenterName || 'unknown'}</span>`

        document.getElementById('comment-list').appendChild(newComment)        
    }


    function loadCommentCount(newCount){
        document.querySelector('#comment-count .count').textContent = newCount
    }


    function addOneToCommentCount(){
        const currentCount = parseInt(document.querySelector('#comment-count .count').textContent)
        loadCommentCount(currentCount + 1)
    }
    

    // fprocessing the favorites (heart) button ------------------------------------------

    const favoriteSong = document.getElementById('favorite')
    favoriteSong.addEventListener('click', e => {
        
        const currentlyPlaying = document.getElementById('currently-playing')
        const songPlaylist = currentlyPlaying.classList[0]
        const songId = currentlyPlaying.classList[1]

        let songIsBeingLiked;
        if(personAlreadyLikesThisSong(e.target)){
            songIsBeingLiked = false
        }else{
            songIsBeingLiked = true
        }

        const likeCount = newNoOfLikes(songIsBeingLiked)
        fetch(`${apiHost}/${songPlaylist}/${songId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    liked: songIsBeingLiked,
                    likes: likeCount
                }
            )
        })
        .then(result => result.json())
        .then(data => {
            const activeButton = getActiveButton()
            
            document.getElementById('play-list-items').innerHTML = ''
            getAndLoadPlaylist(activeButton)
            
            updateLikeStatus(songIsBeingLiked)
            loadLikes(data.likes)
        })
    })

    function getActiveButton(){
        if(document.getElementById('favorites-playlist').classList.contains('active')){
            return 'favorites'
        }else if(document.getElementById('blues-rock-playlist').classList.contains('active')){
            return 'bluesRock'
        }else if(document.getElementById('blues-jazz-playlist').classList.contains('active')){
            return 'bluesJazz'
        }else{
            return 'recommendedForYou'
        }
    }


    function personAlreadyLikesThisSong(heartIcon){
        return heartIcon.classList.contains('fa-solid'); 
    }


    function newNoOfLikes(songIsBeingLiked){
        const count = document.querySelector('#like-count .count')
        if(songIsBeingLiked){
            return parseInt(count.textContent) + 1
        }else{
            return parseInt(count.textContent) - 1
        }
    }


    // processing the song list item ----------------------------------------------------

      function moveToCurrentlyPlaying(song, playlist){
        //This functions expects an <li></li> (not necessarily empty)

        const currentlyPlaying = document.getElementById('currently-playing')
        currentlyPlaying.classList = ""
        currentlyPlaying.classList.add(playlist)
        currentlyPlaying.classList.add(song.id)

        currentlyPlaying.querySelector('.song-name h1').textContent = song.querySelector('p').textContent
        currentlyPlaying.querySelector('.artist-name').textContent = `- ${song.querySelector('.artist-name').textContent}`
    }


    function updateUpNext(song){
        //updates list of songs marked to play next

        const songsToPlayNext = document.getElementById('up-next')

        songsToPlayNext.innerHTML = ''
        let sibling = song
        for(let i = 0; i < 3; i++){
            const nextSibling = document.createElement('li')
            nextSibling.classList.add('song')
            if(sibling.nextElementSibling){
                nextSibling.innerHTML = sibling.nextElementSibling.innerHTML
                sibling = sibling.nextElementSibling
            }else{            
                nextSibling.innerHTML = sibling.parentElement.firstElementChild.innerHTML
                sibling = sibling.parentElement.firstElementChild
            }

            nextSibling.querySelector('.artist-name').classList.add('display-none')
            songsToPlayNext.append(nextSibling)
        }
    }


    // processnig the playlist buttons ---------------------------------------------------

    const playlistButtons = document.getElementById('playlist-buttons')
    Array.from(playlistButtons.children).forEach(playlistChoice => {
        playlistChoice.addEventListener('click', e=> {
            emptyPlaylistOnDisplay()
            
            if(e.target.id === 'blues-rock-playlist'){
                getAndLoadPlaylist('bluesRock')
            }else if(e.target.id === 'favorites-playlist'){
                getAndLoadPlaylist('favorites')
            }else if(e.target.id === 'blues-jazz-playlist'){
                getAndLoadPlaylist('bluesJazz')
            }
            //We are not processing the "more" button for now

            switchActiveButton(e.target, playlistButtons)
        })
    })

    
    getAndLoadPlaylist('recommendedForYou', 'recommended-for-you')

    function emptyPlaylistOnDisplay(){
        document.getElementById('play-list-items').innerHTML = ''
    }


    function switchActiveButton(buttonToMakeActive, allPlaylistButtons){
        buttonToMakeActive.classList.add('active')

        Array.from(allPlaylistButtons.children).forEach(button => {
            if(button.id !== buttonToMakeActive.id){
                button.classList.remove('active')
            }
        })
    }


    // playing the songs -------------------------------------------------

    function playSong(pathToSong){
        pathToSong = './assets/music/blues-jazz/Eilen Jewell - I Remember You.mp3'
        const audio  = new Audio()
        audio.src = pathToSong
        const playButton = document.getElementById('play-pause-button')
        playButton.addEventListener('click', e => {
            if(playButton.classList.contains('fa-circle-play')){
                playButton.classList.remove('fa-circle-play')
                playButton.classList.add('fa-circle-pause')
                audio.play()
                showSongProgress(audio)
            }else {
                playButton.classList.remove('fa-circle-pause')
                playButton.classList.add('fa-circle-play')
                audio.pause()                
            }
        })

        previouslyPlayedSongs.push(
            {
                audio: audio,
            }
        )
    }

    
    function showSongProgress(audio){
        document.getElementById('song-progress').end = parseInt(audio.duration)
               
        document.getElementById('song-progress').value = 0
        setInterval(() =>{
            document.getElementById('song-progress').value = audio.currentTime/audio.duration * 100
        }, 1)
    }
})