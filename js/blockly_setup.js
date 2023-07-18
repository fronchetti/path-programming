/* "Extensions are functions that run on each block of a given type as the block is created." - Blockly */
/* This extension fill the movement position dropdown with default field values. */
Blockly.Extensions.register('move_block_created',
function() {
  this
  .getInput('POSITION')
  .appendField(new Blockly.FieldDropdown(
    function() {
      var options = [];

      for (let [name, key] of savedVariables) {
        options.push([name, key]);
      }

      return options;
    }), 'DROPDOWN_OPTIONS');
});

function updateDropdownOptions(dropdownField) {
  var dropdownOptions = dropdownField.getOptions(false);

  // Push unsaved positions into dropdown options
  // TODO: Optmize this verification to reduce complexity
  for (let [name, key] of savedVariables) {
    value_exists = false;

    for (let [optionName, optionKey] of dropdownOptions) {
      // If position already exists in dropdown options, break */
      if (key == optionKey) {
        value_exists = true;
        break;
      }
    }

    if (!value_exists) {
      dropdownOptions.push([name, key]);
    }
  }

  dropdownField.menuGenerator_ = dropdownOptions;
}

function updateBlocklyBlocks() {
  Blockly.getMainWorkspace().getBlocksByType("move_to_position").forEach(function(block) {
    var dropdownField = block.getField('DROPDOWN_OPTIONS');
    updateDropdownOptions(dropdownField);
  });  
}

Blockly.defineBlocksWithJsonArray([
  /* Custom movement block */
  {
    "type": "custom_start",
    "message0": "When program is started:",
    "nextStatement": null,
    "colour": 210,
    "tooltip": "",
    "helpUrl": ""
  },
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
    "extensions": ["move_block_created"]
  },
  /* Custom pick object block */
  {
    "type": "pick_object",
    "message0": "Pick up object",
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 40,
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
    "colour": 90,
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
      "text": "Start Program",
      "callbackKey": "run-program"
    },
    {
      "kind": "button",
      "text": "Create Position",
      "callbackKey": "create-position"
    },
    {
      "kind": "button",
      "text": "Manage  Positions",
      "callbackKey": "manage-positions",
    },
    {
      "kind": "label",
      "text": "Blocks",
    },
    {
      "kind": "block",
      "type": "pick_object"
    },
    {
      "kind": "block",
      "type": "release_object"
    },
    {
      "kind": "block",
      "type": "move_to_position"
    },
  ]
}

const blocklyDiv = document.getElementById('blockly-workspace');
const blocklyWorkspace = Blockly.inject(blocklyDiv, {
          toolbox: toolbox, zoom:
          {controls: true,
          startScale: 1.5,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
          pinch: true},
          move: {
            scrollbars: {
              horizontal: true,
              vertical: true
            },
            drag: true,
            wheel: false},
          trashcan: true});

Blockly.HSV_SATURATION = 0.6;
Blockly.HSV_VALUE = 0.75;
var startingBlocks = document.getElementById("blocks");
Blockly.Xml.domToWorkspace(startingBlocks, blocklyWorkspace);

var startingBlock = Blockly.getMainWorkspace().getBlocksByType("custom_start")[0];
blocklyWorkspace.centerOnBlock(startingBlock.id);
startingBlock.setDeletable(false);

blocklyWorkspace.registerButtonCallback("run-program", executeBlocklyCode);
blocklyWorkspace.registerButtonCallback("create-position", loadCreatePositionModal);
blocklyWorkspace.registerButtonCallback("manage-positions", loadManagePositionsModal);

function executeBlocklyCode() {
  if (startingBlock) {
    var attachedBlocks = startingBlock.getDescendants();
    var currentScene = game.scene.getScene("Sandbox");
    currentScene.setAnimationBlocks(attachedBlocks);
    currentScene.executeAnimation();
  } else {
    console.log("Blockly: No starting block available.")
  }
}

function getBlocklyPositions() {
  if (startingBlock) {
    var attachedBlocks = startingBlock.getDescendants();
    var movementBlocks = [];

    for (var i = 0; i < attachedBlocks.length; i++) {
      var currentBlock = attachedBlocks[i];

      if (currentBlock.type === "move_to_position") {
        var positionKey = currentBlock.getFieldValue("DROPDOWN_OPTIONS");
        var coordinates = savedCoordinates.get(positionKey);
        movementBlocks.push([positionKey, coordinates]);
      }
    }

    return movementBlocks;
  } else {
    console.log("Blockly: No starting block available.")
  }  
}