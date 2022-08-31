document.addEventListener('DOMContentLoaded', () =>{
    
    
    const favoriteSong = document.getElementById('favorite')
    favoriteSong.addEventListener('click', e => {
        toggleHeartAppearance(e.target)
    })

    function toggleHeartAppearance(heartIcon){
        if(heartIcon.classList.contains('fa-regular')){
            heartIcon.classList.remove('fa-regular')
            heartIcon.classList.add('fa-solid')
        }else if(heartIcon.classList.contains('fa-solid')){
            heartIcon.classList.remove('fa-solid')
            heartIcon.classList.add('fa-regular')
        }
    }
