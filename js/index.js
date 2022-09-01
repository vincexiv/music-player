const apiHost = 'http://localhost:3000'

document.addEventListener('DOMContentLoaded', () =>{

    getAndLoadPlaylist("favorites")//by default, the "favorites playlist should be displayed"

    function getAndLoadPlaylist(playlistName, listId = 'play-list-items'){
        if(playlistName == 'recommendedForYou'){console.log('we are heer')}
        fetch(`${apiHost}/${playlistName}`)
        .then(result => result.json())
        .then(data => {
            data.forEach(songData => {
                const song = createPlayListItem(songData)
                addSongToDom(song, listId)
                song.addEventListener('click', e => {
                    moveToCurrentlyPlaying(song)
                    updateUpNext(song)
                    updateBanner(songData)
                })
            })
        })
    }
    
    function createPlayListItem(songData){
        const playListItem = document.createElement('li')
        playListItem.classList.add('song')
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
        if(songData.banner){
            const banner = document.getElementById('currently-playing-song-banner')
            banner.src = songData.banner
            banner.alt = songData.songArtist
        }
    }

    // Comment form ------------------------------------------------------

    handleCommentForm()
    function handleCommentForm(){
        const commentForm = document.getElementById('add-comment-form')
        commentForm.addEventListener('submit', e => {
            e.preventDefault()

            const newComment = e.target.querySelector('textarea').value
            addCommentToDom(newComment)
            updateCommentCount()

            commentForm.reset()
        })
    }

    function addCommentToDom(commentInput){
        const newComment = document.createElement("li")
        newComment.innerHTML = `<p>${commentInput}</p>
                                <span class="commenter-name">Vincent</span>`//at this point, it assumes I'm logged in as "Vincent"

        document.getElementById('comment-list').appendChild(newComment)        
    }

    function updateCommentCount(){
        const commentCount = document.querySelector('#comment-count .count')
        commentCount.textContent = parseInt(commentCount.textContent) + 1
    }
    

    // favorites (heart) button ------------------------------------------

    const favoriteSong = document.getElementById('favorite')
    favoriteSong.addEventListener('click', e => {

        let increaseLikeCount = false
        if(personLikesThisSong(e.target)){
            unlikeSong(e.target)
        }else{
            likeSong(e.target)
            increaseLikeCount = true
        }

        updateLikeCount(increaseLikeCount)
    })

    function personLikesThisSong(heartIcon){
        return heartIcon.classList.contains('fa-solid'); 
    }

    function likeSong(heartIcon){
        if(heartIcon.classList.contains('fa-regular')){
            heartIcon.classList.remove('fa-regular')
            heartIcon.classList.add('fa-solid')
        }
    }

    function unlikeSong(heartIcon){
        if(heartIcon.classList.contains('fa-solid')){
            heartIcon.classList.remove('fa-solid')
            heartIcon.classList.add('fa-regular')
        }
    }

    function updateLikeCount(increaseLikeCount){
        const count = document.querySelector('#like-count .count')        
        if(increaseLikeCount){
            count.textContent = parseInt(count.textContent) + 1
        }else{
            count.textContent = parseInt(count.textContent) - 1
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


    // playlist ----------------------------------------------------------

    const playlistButtons = document.getElementById('playlist-buttons')
    Array.from(playlistButtons.children).forEach(playlistChoice => {
        playlistChoice.addEventListener('click', e=> {
            console.log("button clicked: ", e.target)
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
})