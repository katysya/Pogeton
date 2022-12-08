import {getJSON} from "./getJSON.js";

function fetchProjectUnits() {
    const cardBlock = document.getElementsByClassName("card__block")[0];
    getJSON("/api/v1/project_unit", (status, projectUnits) => {
        projectUnits.forEach(unit => {
            cardBlock.innerHTML = cardBlock.innerHTML + `
                <div class="card__item">
                    <img class="card__img" src="/static/${unit.id}.png" alt="Card">
                    
                   0<input type="file" id="fileUpload_${unit.id}"/>
                    
                    <form action="">
                        <input type="text" class="card__desc" value="${unit.link}"/>
                        <input type="text" class="card__desc" value="${unit.title}"/>
                        <input type="text" class="card__hashtags" value="${unit.tags}"/>
                        <input type="submit" value="сохранить ✅">
                    </form>
                </div>
            `

            document.getElementById(`fileUpload_${unit.id}`).addEventListener('change', event => {
                handleImageUpload(event)
            })
        })
    }, () => {
        console.log("SOME ERROR)))")
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchProjectUnits();
});

const handleImageUpload = event => {
    const files = event.target.files
    const formData = new FormData()
    formData.append('myFile', files[0])

    fetch('http://localhost/api/v1/upload', {
        method: 'POST', body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.path)
        })
        .catch(error => {
            console.error(error)
        })
}