/* savedVariables saves the position names created by the user.
In the example below, "Home" is the variable name, and "HOME_POSITION"
the language-neutral key that identifies this variable in Blockly. */
const savedVariables = new Map();
savedVariables.set("Home", "HOME");
savedVariables.set("Test", "TEST");
savedVariables.set("Test2", "TEST2");
savedVariables.set("Test3", "TEST3");


/* savedCoordinates saves the positions coordinates from the Phaser environment.
In the example below, "HOME_POSITION" is the language-neutral key from Blockly, 
and [0, 0] the coordinates in Phaser. */
const savedCoordinates = new Map();
savedCoordinates.set("HOME", [1024, 1024])
savedCoordinates.set("TEST", [424, 424])
savedCoordinates.set("TEST2", [124, 124])
savedCoordinates.set("TEST3", [124, 924])

function createNewPosition(name, key, coordinates) {
    if (name === undefined || key == undefined || coordinates === undefined) {
        window.alert("Arguments missing.");
    } else {
        if(!savedVariables.has(name)) {
            savedVariables.set(name, key);
            savedCoordinates.set(key, coordinates);
            createPositionModal.hide();
            updateBlocklyBlocks();    
        } else {
            window.alert("A variable with the same name already exists."); 
        }
    }
}
