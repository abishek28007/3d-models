import React, { Component } from 'react';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import BabylonScene from './SceneComponent'; // import the component above linking to file we just created.

export default class Model extends Component {
  setup=(e)=> {
    const { canvas, scene } = e;

    var camera = new BABYLON.UniversalCamera(
      "UniversalCamera",
      new BABYLON.Vector3(0, 0, -10),
      scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
  };

  run=(e)=> {
    const { scene, engine } = e;
    console.log(e);
    engine.runRenderLoop(() => {
      if (scene) {
        scene.render();
      }
    });
  };

  onSceneMount=(e)=> {
    const { scene } = e;

    this.setup(e);
    // BABYLON.SceneLoader.Append('/assets/bmw/','scene.gltf', scene, function(scene) {
    //   let model = scene.getMeshByName("__root__");

    //   model.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.WORLD);
    //   scene.createDefaultEnvironment({
    //     createSkybox: false,
    //     createGround: false
    //   });
    //   scene.createDefaultCameraOrLight(true, true, true);
    // });
    BABYLON.SceneLoader.Append('/assets/lamborghini_veneno/', 'scene.gltf', scene, function (scene) {
      let model = scene.getMeshByName("__root__");

      model.rotate(BABYLON.Axis.Y, Math.PI / 2, BABYLON.Space.WORLD);
      // https://www.babylonjs-playground.com/#102TBD#31
      // wheelFI.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD);
      scene.createDefaultEnvironment({
        createSkybox: false,
        createGround: false
      });
      scene.createDefaultCameraOrLight(true, true, true);
      const inputMap = {};
      scene.actionManager = new BABYLON.ActionManager(scene);
      scene.onBeforeRenderObservable.add(() => {
        if (inputMap["w"] || inputMap["ArrowUp"]) {
          model.position.z += 5
        }
        if (inputMap["a"] || inputMap["ArrowLeft"]) {
          model.position.x -= 5
        }
        if (inputMap["s"] || inputMap["ArrowDown"]) {
          model.position.z -= 5
        }
        if (inputMap["d"] || inputMap["ArrowRight"]) {
          model.position.x += 5
        }
      });
      scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        console.log(evt.sourceEvent.key, inputMap[evt.sourceEvent.key],evt.sourceEvent.type);
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
      }));
      scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
      }));     
      e.scene = scene;
    });
    this.run(e);
  };

  render() {
    return (
      <div>
        <BabylonScene onSceneMount={this.onSceneMount} />
      </div>
    );
  }
}