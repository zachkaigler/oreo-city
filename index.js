// Stable elements
let oreoBar = document.querySelector("div#oreo-header.header")
let commentForm = document.querySelector("form#comment-form")
let expertRatingH2 = document.querySelector("h3#expert-rating")
let commentValue = document.querySelector("textarea#comment")
let nameValue = document.querySelector("input#name")
let commentList = document.querySelector("ul#comment-list")
let userRating = document.querySelector("input#rating")
let averageUserRating = document.querySelector("h3#user-rating")
let contentContainer = document.querySelector("div#main-content")
let mainImgContainer = document.querySelector("div#main-img-container")

// Global Variables
let currentOreo = {}
let sum = 0

// Initial DOM population w/ click functionality
fetch("http://localhost:3000/oreos?_embed=comments")
    .then(resp => resp.json())
    .then(function(oreoArray) {
        oreoArray.forEach(function(oreoObj) {
            let oreoDiv = document.createElement("div")
                oreoDiv.classList = "oreo-bar"
            let oreoLabel = document.createElement("p")
                oreoLabel.innerText = `${oreoObj.flavor} - ${oreoObj.expertRating}`
            let oreoImg = document.createElement("img")
                oreoImg.src = oreoObj.image
                oreoImg.alt = oreoObj.flavor
                oreoImg.classList = "main-oreo-img"
            
            oreoDiv.append(oreoImg, oreoLabel)
            oreoBar.append(oreoDiv)
            
            // Click functionality
            oreoImg.addEventListener("click", function() {
                currentOreo = oreoObj
                mainImgContainer.innerHTML = ""
                let oreoMainImg = document.createElement("img")
                    oreoMainImg.src = oreoObj.image
                    oreoMainImg.alt = oreoObj.flavor
                    oreoMainImg.id = "placeholder-img"
                mainImgContainer.append(oreoMainImg)
                commentForm.dataset.id = oreoObj.id
                expertRatingH2.innerText = `Expert: ${oreoObj.expertRating}`
                commentList.innerHTML = ""
                oreoObj.comments.forEach(function(commentObj){
                    makeAnOreoComment(commentObj)
                })
                
                if (currentOreo.comments.length === 0) {
                    averageUserRating.innerText = `User: N/A`
                } else if (oreoObj.avgRating !== 0) {
                    averageUserRating.innerText = `User: ${oreoObj.avgRating.toFixed(1)}`
                } else {
                    averageUserRating.innerText = `User: N/A`
                }
            })
        })
    })

// Form submit functionality
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
    .then(function(newCommentObj){

        // Calculate average user score and update server + DOM
        fetch('http://localhost:3000/oreos?_embed=comments')
            .then (resp => resp.json())
            .then (function(oreosArray) {
                sum = 0
                oreosArray[newCommentObj.oreoId - 1].comments.forEach(function(comment) {
                    sum = sum + parseInt(comment.rating, 10)
                })
                
                fetch (`http://localhost:3000/oreos/${newCommentObj.oreoId}`, {
                    method: "PATCH",
                    headers: {
                        'content-type': 'application/json' 
                    },
                    body: JSON.stringify({
                        avgRating: sum / oreosArray[newCommentObj.oreoId - 1].comments.length,
                    })
                })
                    .then(resp => resp.json())
                    .then(function(updatedOreoObj) {
                        commentForm.reset()
                        commentValue.value = ""
                        makeAnOreoComment(newCommentObj)
                        averageUserRating.innerText = `User: ${updatedOreoObj.avgRating.toFixed(1)}`
                        currentOreo.avgRating = updatedOreoObj.avgRating
                        currentOreo.comments = [...currentOreo.comments, newCommentObj]
                    })
            })

    })
})

// Append to DOM helper function
function makeAnOreoComment(commentObj){
    let blankLi = document.createElement("li")
        blankLi.classList = "user-comment"  
        blankLi.innerText = `${commentObj.name} - Rating: ${commentObj.rating}`
    let blankP = document.createElement("p")
        blankP.innerText = commentObj.comment
        blankP.classList = "real-comment"
    let deleteButton = document.createElement("button")
        deleteButton.innerText = "X"
        deleteButton.classList = "delete-button"
    blankLi.append(blankP, deleteButton)
    commentList.append(blankLi)

    // Delete button functionality
    deleteButton.addEventListener("click", function(){
        fetch(`http://localhost:3000/comments/${commentObj.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(function(emptyObj){
            blankLi.remove()

            fetch(`http://localhost:3000/oreos/${currentOreo.id}?_embed=comments`)
                .then (resp => resp.json())
                .then (function (oreoWithoutComment) {
                    currentOreo.comments = oreoWithoutComment.comments
                    
                    sum = 0
                    oreoWithoutComment.comments.forEach(function(comment) {
                        sum = sum + parseInt(comment.rating, 10)
                    })
                    
                    if (sum !== 0) {
                        fetch (`http://localhost:3000/oreos/${currentOreo.id}`, {
                            method: "PATCH",
                            headers: {
                                'content-type': 'application/json' 
                            },
                            body: JSON.stringify({
                                avgRating: sum / oreoWithoutComment.comments.length,
                            })
                        })
                            .then(resp => resp.json())
                            .then(function(updatedOreoObj) {
                                averageUserRating.innerText = `User: ${updatedOreoObj.avgRating.toFixed(1)}`
                                currentOreo.avgRating = updatedOreoObj.avgRating
                            })
                    } else {
                        averageUserRating.innerText = `User: N/A`
                    }
                })
        })
    })
}

   