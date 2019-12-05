import * as BABYLON from 'babylonjs';

export default function createScene(engine) {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    //Loading screen definition starts here
    //-------------------------------------------------------------------------------
    var loadingBG = new BABYLON.GUI.Rectangle();
    loadingBG.width = 1.0;
    loadingBG.height = 1.0;
    loadingBG.color = "black";
    loadingBG.background = "black";

    var loadingText = new BABYLON.GUI.TextBlock();
    loadingText.text = "Loading...";
    loadingText.left = 0.5;
    loadingText.top = 0.7;
    loadingText.color = "white";

    var loadingSquare = new BABYLON.GUI.Rectangle();
    loadingSquare.width = 0.3;
    loadingSquare.height = 0.2;
    loadingSquare.color = "red";
    loadingSquare.background = "red";
    loadingSquare.top = "-20%";

    var fullscreenGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("FullscreenUI", true);

    fullscreenGUI.addControl(loadingBG); //Show loading screen
    fullscreenGUI.addControl(loadingText);
    fullscreenGUI.addControl(loadingSquare);

    scene.registerBeforeRender(function(){ //Spin the square
        var deltaTime = scene.getEngine().getDeltaTime();
        loadingSquare.rotation += 0.001* deltaTime;
    });    

    //--------------------------------------------------------------------------------------------

    // This targets the camera to scene origin
    // camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    // camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    // var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    // light.intensity = 0.7;

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Move the sphere upward 1/2 its height
    // sphere.position.y = 1;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    // var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

    /* Use this in your actual scene to remove the loading screen instead of a timer
    -------------------------------------------------------------------------------------------
    scene_This.executeWhenReady(function () { //When everything is done loading
        fullscreenGUI.removeControl(loadingText); //Remove our loading screen
        fullscreenGUI.removeControl(loadingBG);
    }); 
    ----------------------------------------------------------------------------------------------
    */
    
    setTimeout(function(){
        fullscreenGUI.removeControl(loadingText); //Remove our loading screen
        fullscreenGUI.removeControl(loadingBG);
        fullscreenGUI.removeControl(loadingSquare);
    }, 5000);

    return scene;

};