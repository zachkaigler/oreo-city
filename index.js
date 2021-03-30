let oreoBar = document.querySelector("div#oreo-header.header")
let oreoMainImg = document.querySelector("img#placeholder-img")
let commentForm = document.querySelector("form#comment-form")
let expertRatingH2 = document.querySelector("h2#expert-rating")
let commentValue= document.querySelector("input#comment")
let nameValue= document.querySelector("input#name")
let commentList = document.querySelector("ul#comment-list")
let userRating = document.querySelector("input#rating")
let averageUserRating = document.querySelector("h2#user-rating")
let currentOreo = {}
let sum = 0

fetch("http://localhost:3000/oreos?_embed=comments")
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
                sum = 0
                oreoMainImg.src = oreoObj.image
                oreoMainImg.alt = oreoObj.flavor
                commentForm.dataset.id = oreoObj.id
                expertRatingH2.innerText = `Expert Rating: ${oreoObj.expertRating}`
                currentOreo = oreoObj
                commentList.innerHTML = ""
                oreoObj.comments.forEach(function(comment){
                    sum = sum + parseInt(comment.rating, 10)
                })
                let average = sum / oreoObj.comments.length
                average = average.toFixed(1)
                averageUserRating.innerText = `User Rating: ${average}`
                oreoObj.comments.forEach(function(commentObj){
                    makeAnOreoComment(commentObj)
                })

               
            })
        })
    })

    commentForm.addEventListener("submit", function(evt){
        evt.preventDefault()
        let ID = currentOreo.id
        fetch(`http://localhost:3000/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                oreoId: ID,
                name: nameValue.value,
                comment: commentValue.value,
                rating: userRating.value
            })
        })
        .then(res => res.json())
        .then(function(commentObj){
           makeAnOreoComment(commentObj)
        })



    })

    function makeAnOreoComment(commentObj){
        let blankLi = document.createElement("li")
        blankLi.classList = "user-comment"  
        blankLi.innerText = `${commentObj.name} - Rating: ${commentObj.rating}`
        let blankP = document.createElement("p")
        blankP.innerText = commentObj.comment

        blankLi.append(blankP)
        commentList.append(blankLi)
    }