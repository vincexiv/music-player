const apiHost = 'http://localhost:3000'

document.addEventListener('DOMContentLoaded', () =>{

    getAndLoadPlaylist("favorites")//by default, the "favorites playlist should be displayed"
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
            banner.src('./assets/images/Buddy Guy.png')  //buddy guy with the guitar is the default
            banner.alt = 'Buddy Guy with the guitar'
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


    // Comment form ------------------------------------------------------

    handleCommentForm()
    function handleCommentForm(){
        const commentForm = document.getElementById('add-comment-form')
        commentForm.addEventListener('submit', e => {
            e.preventDefault()

            const newComment = e.target.querySelector('textarea').value
            addCommentToDom({commenterName: "Vincent", content: newComment})
            addOneToCommentCount(newComment)

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
    

    // favorites (heart) button ------------------------------------------

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
            if(favoritesButtonIsActive()){
                document.getElementById('play-list-items').innerHTML = ''
                getAndLoadPlaylist('favorites')
            }
            updateLikeStatus(songIsBeingLiked)
            loadLikes(data.likes)
        })
    })

    function favoritesButtonIsActive(){
        return document.getElementById('favorites-playlist').classList.contains('active')
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


    // Song list item ----------------------------------------------------

    function moveToCurrentlyPlaying(song){
        //This functions expects an <li></li> (not necessarily empty)

        const currentlyPlaying = document.getElementById('currently-playing')

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


    // playlist button ---------------------------------------------------

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

    (function playSong(){
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
    })()
    
    function showSongProgress(audio){
        document.getElementById('song-progress').end = parseInt(audio.duration)
        
        console.log(document.getElementById('song-progress'))
        
        document.getElementById('song-progress').value = 0
        setInterval(() =>{
            document.getElementById('song-progress').value = audio.currentTime/audio.duration * 100
        }, 1)
    }
})