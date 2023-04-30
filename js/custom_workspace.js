mapPositions = new Map();
mapPositions.set("Home", "HOME_POSITION");

/* "Extensions are functions that run on each block of a given type as the block is created." - Blockly */
/* This extension fill the movement position dropdown with default field values. */
Blockly.Extensions.register('move_block_created',
function() {
  this
  .getInput('POSITION')
  .appendField(new Blockly.FieldDropdown(
    function() {
      var options = [];

      for (let [mapPosition, mapValue] of mapPositions) {
        options.push([mapPosition, mapValue]);
      }

      return options;
    }), 'DROPDOWN_OPTIONS');
});

/* This extension listens to changes in the field value of the movement position dropdown. */
Blockly.Extensions.register('move_block_changed', function() {
  this.setOnChange(function() {
    if (this.getField('DROPDOWN_OPTIONS')) {
      var dropdownField = this.getField('DROPDOWN_OPTIONS');
      var dropdownValue = this.getFieldValue('DROPDOWN_OPTIONS');

      if (dropdownValue == "NEW_POSITION") {
        var positionName = prompt("Define a name for this position:", "New Position");
        mapPositions.set(positionName, positionName.toUpperCase());
        updateDropdownOptions(dropdownField);
        dropdownField.doValueUpdate_(positionName.toUpperCase());
        dropdownField.forceRerender(); // Required instruction as it updates the dropdown visually 
        updateBlocks();
      }

    } else {
      this.setWarningText('Must have an input block.');
    }
  });
});

function updateDropdownOptions(dropdownField) {
  var dropdownOptions = dropdownField.getOptions(false);

  // Push unsaved positions into dropdown options
  // TODO: Optmize this verification to reduce complexity
  for (let [mapPosition, mapValue] of mapPositions) {
    value_exists = false;

    for (let [dropPosition, dropValue] of dropdownOptions) {
      // If position already exists in dropdown options, break */
      if (mapValue == dropValue) {
        value_exists = true;
        break;
      }
    }

    if (!value_exists) {
      dropdownOptions.push([mapPosition, mapValue]);
    }
  }

  dropdownField.menuGenerator_ = dropdownOptions;
}

function updateBlocks() {
Blockly.getMainWorkspace().getBlocksByType("move_to_position").forEach(function(block) {
  var dropdownField = block.getField('DROPDOWN_OPTIONS');
  updateDropdownOptions(dropdownField);
});  
}

  
Blockly.defineBlocksWithJsonArray([
  /* Custom movement block */
  {
    "type": "move_to_position",
    "message0": "Move robot to %1",
    "args0": [
      {
        "type": "input_dummy",
        "name": "POSITION",
        "variable": "<somewhere>"
      }
    ],
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 8,
    "tooltip": "",
    "helpUrl": "",
    "extensions": ["move_block_created", "move_block_changed"]
  },
  /* Custom pick object block */
  {
    "type": "pick_object",
    "message0": "Pick object",
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 50,
    "tooltip": "",
    "helpUrl": "",
    "extensions": []
  },
  /* Custom release object block */
  {
    "type": "release_object",
    "message0": "Release object",
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 100,
    "tooltip": "",
    "helpUrl": "",
    "extensions": []
  },
]);

const toolbox = {
  "kind": "flyoutToolbox",
  "contents": [
    {
      "kind": "label",
      "text": "Actions",
    },
    {
      "kind": "button",
      "text": "Manage Positions",
      "callbackKey": "manage-positions"
    },
    {
      "kind": "label",
      "text": "Blocks",
    },
    {
      "kind": "block",
      "type": "move_to_position"
    },
    {
      "kind": "block",
      "type": "pick_object"
    },
    {
      "kind": "block",
      "type": "release_object"
    },
  ]
}

const blocklyDiv = document.getElementById('blockly-workspace');
const workspace = Blockly.inject(blocklyDiv, {
          toolbox: toolbox, zoom:
          {controls: true,
          wheel: true,
          startScale: 1.5,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
          pinch: true},
          trashcan: true});

workspace.registerButtonCallback("manage-positions", managePositions);

function managePositions() {
  const listModal = new bootstrap.Modal(document.getElementById('list-positions-modal')).show();
  var positions = document.getElementById('positions-list');
  var fill = "";

  for (let [mapPosition, mapValue] of mapPositions) {
    fill += '<a id="position-value" class="list-group-item">\
              <div class="row">\
                  <div id="position-name" class="col-6">' + mapPosition + '</div>\
                  <div id="position-options" class="col-6">\
                      <button type="button" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-pen"></i> Rename</button>\
                      <button type="button" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-crosshairs"></i> Reposition</button>\
                  </div>\
              </div>\
            </a>'
  }

  positions.innerHTML = fill;
}

var createPositionButton = document.getElementById("create-position-button");

createPositionButton.addEventListener("click", function(event){
  var createModal = document.getElementById('create-position-modal');
  var modal = bootstrap.Modal.getInstance(createModal)
  modal.hide();
});

function createPosition() {
  console.log("Teste")
}