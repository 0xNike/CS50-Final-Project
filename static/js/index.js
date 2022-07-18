document.addEventListener('DOMContentLoaded', function() {

    let importHealth = document.querySelector("#import-health").textContent;
    let face = document.querySelector("#wojak-face")

    if (importHealth <= 0) {
        face.innerHTML = '<img src="/static/images/wojak-toh.jpg" class="img mx-auto d-block">';

    }
    else {
        console.log(importHealth)
        if (importHealth > 40 && importHealth <= 70) {
            face.innerHTML = '<img src="/static/images/wojak-default.jpg" class="img-thumbnail mx-auto d-block">';
        }
        else if (importHealth <= 40 && importHealth > 30 ) {
            face.innerHTML = '<img src="/static/images/wojak-hodl.jpg" class="img-thumbnail mx-auto d-block">';
        }
        else if (importHealth <= 30) {
            face.innerHTML = '<img src="/static/images/wojak-cry1.png" class="img-thumbnail mx-auto d-block">';
        }
    } 

});