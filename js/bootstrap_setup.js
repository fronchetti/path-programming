const managePositionsModal = new bootstrap.Modal(document.getElementById("list-positions-modal"));
const createPositionModal = new bootstrap.Modal(document.getElementById("create-position-modal"));

var createPositionButton = document.getElementById("create-position-button");
createPositionButton.addEventListener("click", requestNewPosition);

function loadCreatePositionModal() {
    createPositionModal.show();
}

function loadManagePositionsModal() {
    managePositionsModal.show();
    var positionsElement = document.getElementById("positions-list");
    var htmlContent = "";
  
    for (let [name, key] of savedVariables) {
        htmlContent += '<a id="position-value" class="list-group-item">\
                <div class="row">\
                    <div id="position-name" class="col-8">' + name + '</div>\
                    <div id="position-options" class="col-4">\
                        <button type="button" class="btn btn-outline-primary"><i class="fa-solid fa-pen"></i>Remove</button>\
                    </div>\
                </div>\
              </a>'
    }

    positionsElement.innerHTML = htmlContent;
}

function requestNewPosition() {
    var positionName = document.getElementById("position-name").value;

    if (positionName !== "") {
        var currentScene = game.scene.getScene("Sandbox");
        var positionKey = positionName.toUpperCase();
        var positionCoordinate = currentScene.getGripperPosition();
        createNewPosition(positionName, positionKey, positionCoordinate);
    } else {
        window.alert("Position name is missing.");
    }
}