const managePositionsModal = new bootstrap.Modal(document.getElementById("list-positions-modal"));
const createPositionModal = new bootstrap.Modal(document.getElementById("create-position-modal"));

var createPositionButton = document.getElementById("create-position-button");
createPositionButton.addEventListener("click", requestNewPosition);

var showPositionsButton = document.getElementById("show-positions-button");
showPositionsButton.addEventListener("click", toggleShowPositions);

var showDirectionsButton = document.getElementById("show-directions-button");
showDirectionsButton.addEventListener("click", toggleShowDirections);

function loadCreatePositionModal() {
    createPositionModal.show();
}

function loadPositionsForRemoval() {
    managePositionsModal.show();
    var positionsElement = document.getElementById("delete-positions-list");
    var htmlContent = "";
  
    console.log(savedVariables);
    if (savedVariables.size > 1) {
        for (let [name, key] of savedVariables) {
            if (name != "Home") {
                htmlContent += '<a id="delete-position-value" class="list-group-item">\
                <div class="row">\
                    <div id="delete-position-name" class="col-6">' + name + '</div>\
                    <div id="delete-position-options" class="col-6">\
                        <button type="button" id="delete-position-button" value="' + name + '" class="btn btn-danger float-end">Remove</button>\
                    </div>\
                </div>\
              </a>'
            }
        }
    
        positionsElement.innerHTML = htmlContent;
        var removeButtons = document.querySelectorAll("#delete-position-button");
    
        removeButtons.forEach(removeButton => {
            removeButton.addEventListener("click", removePosition, false);
        });    
    } else {
        var positionsElement = document.getElementById("delete-positions-list");
        positionsElement.innerHTML = '<div class="col-12"><p>No positions available.</p></div>'
    }
}

function requestNewPosition() {
    var positionName = document.getElementById("position-name").value;

    if (positionName !== "") {
        var currentScene = game.scene.getScene(phaserSceneName);
        var positionKey = positionName.toUpperCase();
        var positionCoordinate = currentScene.getGripperPosition();
        createNewPosition(positionName, positionKey, positionCoordinate);
    } else {
        window.alert("Position name is missing.");
    }
}

function removePosition(event) {
    var positionName = event.currentTarget.value;
    var positionKey = savedVariables.get(positionName);
    savedVariables.delete(positionName);
    savedCoordinates.delete(positionKey);
    removeBlocksWithPosition(positionKey);
    loadPositionsForRemoval();
}

function toggleShowPositions() {
    var currentScene = game.scene.getScene(phaserSceneName);
    if (currentScene.showCircles === true) {
        currentScene.showCircles = false;
        currentScene.hideCircles();
        currentScene.hideLabels()
    } else {
        currentScene.showCircles = true;
        currentScene.drawCircles();    
        currentScene.drawLabels();
    }
}

function toggleShowDirections() {
    var currentScene = game.scene.getScene(phaserSceneName);
    if (currentScene.showArrows === true) {
        currentScene.showArrows = false;
        currentScene.hideArrows();
    } else {
        currentScene.showArrows = true;
        currentScene.drawArrows();    
    }  
}
