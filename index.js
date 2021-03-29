let oreoBar = document.querySelector("div#oreo-header.header")
let oreoMainImg = document.querySelector("img#placeholder-img")
let commentForm = document.querySelector("form#comment-form")
let expertRatingH2 = document.querySelector("h2#expert-rating")

fetch("http://localhost:3000/oreos")
    .then(resp => resp.json())
    .then(function(oreoArray) {
        oreoArray.forEach(function(oreoObj) {
            let oreoSpan = document.createElement("span")
                oreoSpan.classList = "oreo-bar"
            let oreoImg = document.createElement("img")
                oreoImg.src = oreoObj.image
                oreoImg.alt = oreoObj.flavor
            
            oreoSpan.append(oreoImg)
            oreoBar.append(oreoSpan)

            oreoImg.addEventListener("click", function() {
                oreoMainImg.src = oreoObj.image
                oreoMainImg.alt = oreoObj.flavor
                commentForm.dataset.id = oreoObj.id
                expertRatingH2.innerText = `Expert Rating: ${oreoObj.expertRating}`

                
            })
        })
    })