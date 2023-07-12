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
    "colour": 220,
    "tooltip": "",
    "helpUrl": ""
  },
  {
    "type": "move_to_position",
    "message0": "Move gripper to %1",
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
      "text": "Edit Positions",
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

var startingBlocks = document.getElementById("blocks");
Blockly.Xml.domToWorkspace(startingBlocks, blocklyWorkspace);

var rootBlock = Blockly.getMainWorkspace().getBlocksByType("custom_start")[0];
blocklyWorkspace.centerOnBlock(rootBlock.id);
rootBlock.setDeletable(false);

blocklyWorkspace.registerButtonCallback("run-program", executeBlocklyCode);
blocklyWorkspace.registerButtonCallback("create-position", loadCreatePositionModal);
blocklyWorkspace.registerButtonCallback("manage-positions", loadManagePositionsModal);

function executeBlocklyCode() {
  if (rootBlock) {
    var attachedBlocks = rootBlock.getDescendants();
    var currentScene = game.scene.getScene("Sandbox");

    for (var i = 0; i < attachedBlocks.length; i++) {
      var block = attachedBlocks[i];

      if (block.type === "move_to_position") {
        var positionName = block.getFieldValue("DROPDOWN_OPTIONS");
        var positionCoordinates = savedCoordinates.get(positionName);
        currentScene.appendAction(block.type, positionCoordinates, block.id);
      }
      else if (block.type === "pick_object") {
        currentScene.appendAction(block.type, undefined, block.id);
      }
      else if (block.type === "release_object") {
        currentScene.appendAction(block.type, undefined, block.id);
      }
    }

    currentScene.executeGripperAnimation();
  } else {
    console.log("No root block.")
  }
}
