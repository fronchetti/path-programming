mapPositions = new Map();

let checkSubset = (parentArray, subsetArray) => {
  return subsetArray.every((el) => {
      return parentArray.includes(el)
  })
}

/* "Extensions are functions that run on each block of a given type as the block is created." - Blockly */
/* This extension fill the movement position dropdown with default field values. */
Blockly.Extensions.register('move_block_fill_options',
function() {
  this.getInput('POSITION')
  .appendField(new Blockly.FieldDropdown(
    function() {
      var options = [];
      options.push(["<somewhere>", 'UNDEFINED']);
      options.push(["Home Position", 'HOME_POSITION']);
      options.push(["Create Position", "NEW_POSITION"]);
      return options;
    }), 'DROPDOWN_OPTIONS');
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
    block.getField('DROPDOWN_OPTIONS');
    updateDropdownOptions(block);
  });  
}

/* This extension listens to changes in the field value of the movement position dropdown. */
Blockly.Extensions.register('move_block_warning_on_change', function() {
  this.setOnChange(function(changeEvent) {
    if (this.getField('DROPDOWN_OPTIONS')) {
      var dropdownField = this.getField('DROPDOWN_OPTIONS');
      var dropdownValue = this.getFieldValue('DROPDOWN_OPTIONS');

      if (dropdownValue == "NEW_POSITION") {
        var positionName = prompt("Define a name for this position:", "New Position");
        mapPositions.set(positionName, positionName.toUpperCase());
        updateDropdownOptions(dropdownField);
        dropdownField.doValueUpdate_(positionName.toUpperCase());
        dropdownField.forceRerender(); // Required instruction as it updates the dropdown visually 
      }
    } else {
      this.setWarningText('Must have an input block.');
    }
  });
});
  
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
    // "mutator": "custom_movement_mutator",
    "extensions": ["move_block_fill_options", "move_block_warning_on_change"]
  },
]);

const toolbox = {
  "kind": "flyoutToolbox",
  "contents": [
    {
      "kind": "block",
      "type": "move_to_position"
    },
  ]
}

const blocklyDiv = document.getElementById('blockly-div');
const workspace = Blockly.inject(blocklyDiv, {toolbox: toolbox});
