let oreoBar = document.querySelector("div#oreo-header.header")
let oreoMainImg = document.querySelector("img#placeholder-img")
let commentForm = document.querySelector("form#comment-form")
let expertRatingH2 = document.querySelector("h2#expert-rating")
let commentValue= document.querySelector("input#comment")
let nameValue= document.querySelector("input#name")
let commentList = document.querySelector("ul#comment-list")
let currentOreo = {}
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
                oreoMainImg.src = oreoObj.image
                oreoMainImg.alt = oreoObj.flavor
                commentForm.dataset.id = oreoObj.id
                expertRatingH2.innerText = `Expert Rating: ${oreoObj.expertRating}`
                currentOreo = oreoObj
                commentList.innerHTML = ""
                oreoObj.comments.forEach(function(commentObj){
                    let blankLi = document.createElement("li")
            
                    let blankH = document.createElement("h3")
                    blankH.innerText = commentObj.name
                    let blankP = document.createElement("p")
                    blankP.innerText = commentObj.comment

                    blankLi.append(blankH, blankP)
                    commentList.append(blankLi)



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
                comment: commentValue.value
            })
        })
        .then(res => res.json())
        .then(function(updatedComment){
            let blankLi = document.createElement("li")
            
            let blankH = document.createElement("h3")
            blankH.innerText = updatedComment.name
            let blankP = document.createElement("p")
            blankP.innerText = updatedComment.comment

            blankLi.append(blankH, blankP)
            commentList.append(blankLi)

        })



    })