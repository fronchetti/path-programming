savedPositions = [];

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
      options.push(["Create New Position", "NEW_POSITION"]);
      return options;
    }), 'DROPDOWN_OPTIONS');
  });

/* This extension listens to changes in the field value of the movement position dropdown. */
Blockly.Extensions.register('move_block_warning_on_change', function() {
  this.setOnChange(function(changeEvent) {
    if (this.getField('DROPDOWN_OPTIONS')) {
      var dropdownValue = this.getFieldValue('DROPDOWN_OPTIONS');

      if (dropdownValue == "NEW_POSITION") {
        var positionName = prompt("Define a name for this position:", "New Position");
        var drowpdownField = this.getField('DROPDOWN_OPTIONS');
        var dropdownOptions = drowpdownField.getOptions();
        dropdownOptions.push([positionName, positionName.toUpperCase()]);
        drowpdownField.menuGenerator_ = dropdownOptions;
        // update the savedPositions array with new value
        // Use Blockly.mainWorkspace.getAllBlocks().forEach(function(block){ } to update every block with new position
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
    "message0": "Move arm to %1",
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

const blocklyArea = document.getElementById('language');
const blocklyDiv = document.getElementById('blockly-canvas');

const workspace = Blockly.inject(blocklyDiv, {toolbox: toolbox});

var resizeWorkspace = function(e) {
  // Compute the absolute coordinates and dimensions of blocklyArea.
  var element = blocklyArea;
  let x = 0;
  let y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  // Position blocklyDiv over blocklyArea.
  blocklyDiv.style.left = x + 'px';
  blocklyDiv.style.top = y + 'px';
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
  blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
  Blockly.svgResize(workspace);
};

window.addEventListener('resize', resizeWorkspace, false);
resizeWorkspace();
