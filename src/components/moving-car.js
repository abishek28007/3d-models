import * as BABYLON from 'babylonjs';

export default function createScene(engine) {
  	var scene = new BABYLON.Scene(engine);

  	// camera
 	 var camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 20, new BABYLON.Vector3(0, 0, 0), scene);
  	camera.setPosition(new BABYLON.Vector3(11.5, 3.5, 0));	  
	   
  	// lights
  	// var light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(1, 2, 0), scene);
    var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
	light2.intensity = 0.75;
	 
	/***************************Car*********************************************/
	
	/*-----------------------Car Body------------------------------------------*/ 
	
	//Car Body Material 
	var bodyMaterial = new BABYLON.StandardMaterial("body_mat", scene);
  	bodyMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.25, 0.25);
  	bodyMaterial.backFaceCulling = false;
	
	//Array of points for trapezium side of car.
	var side = [new BABYLON.Vector3(-6.5, 1.5, -2),
				new BABYLON.Vector3(2.5, 1.5, -2),
				new BABYLON.Vector3(3.5, 0.5, -2),
				new BABYLON.Vector3(-9.5, 0.5, -2)				
	];
	
	side.push(side[0]);	//close trapezium
	
	//Array of points for the extrusion path
	var extrudePath = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 4)];
	
	//Create body and apply material
	var carBody = BABYLON.MeshBuilder.ExtrudeShape("body", {shape: side, path: extrudePath, cap : BABYLON.Mesh.CAP_ALL}, scene);
	carBody.material = bodyMaterial;
	camera.parent = carBody;
	/*-----------------------End Car Body------------------------------------------*/
	
	/*-----------------------Wheel------------------------------------------*/ 
	
	//Wheel Material 
	var wheelMaterial = new BABYLON.StandardMaterial("wheel_mat", scene);
  	var wheelTexture = new BABYLON.Texture("http://i.imgur.com/ZUWbT6L.png", scene);
	wheelMaterial.diffuseTexture = wheelTexture;
	
	//Set color for wheel tread as black
	var faceColors=[];
	faceColors[1] = new BABYLON.Color3(0,0,0);
	
	//set texture for flat face of wheel 
	var faceUV =[];
	faceUV[0] = new BABYLON.Vector4(0,0,1,1);
	faceUV[2] = new BABYLON.Vector4(0,0,1,1);
	
	//create wheel front inside and apply material
	var wheelFI = BABYLON.MeshBuilder.CreateCylinder("wheelFI", {diameter: 3, height: 1, tessellation: 24, faceColors:faceColors, faceUV:faceUV}, scene);
  	wheelFI.material = wheelMaterial;
	  
	//rotate wheel so tread in xz plane  
  	wheelFI.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.WORLD); 	
  /*-----------------------End Wheel------------------------------------------*/ 
  
  /*-------------------Pivots for Front Wheels-----------------------------------*/
  var pivotFI = new BABYLON.Mesh("pivotFI", scene);
  pivotFI.parent = carBody;
  pivotFI.position = new BABYLON.Vector3(-6.5, 0, -2);
  
  var pivotFO = new BABYLON.Mesh("pivotFO", scene);
  pivotFO.parent = carBody;
  pivotFO.position = new BABYLON.Vector3(-6.5, 0, 2);  
  /*----------------End Pivots for Front Wheels--------------------------------*/
  
  /*------------Create other Wheels as Instances, Parent and Position----------*/
  var wheelFO = wheelFI.createInstance("FO");
  wheelFO.parent = pivotFO;
  wheelFO.position = new BABYLON.Vector3(0, 0, 1.8);
  
  var wheelRI = wheelFI.createInstance("RI");
  wheelRI.parent = carBody;
  wheelRI.position = new BABYLON.Vector3(0, 0, -2.8);
  
  var wheelRO = wheelFI.createInstance("RO");
  wheelRO.parent = carBody;
  wheelRO.position = new BABYLON.Vector3(0, 0, 2.8);
  
  wheelFI.parent = pivotFI;
  wheelFI.position = new BABYLON.Vector3(0, 0, -1.8);
  /*------------End Create other Wheels as Instances, Parent and Position----------*/
  
  /*---------------------Create Car Centre of Rotation-----------------------------*/
  let pivot = new BABYLON.Mesh("pivot", scene); //current centre of rotation
  pivot.position.z = 50;
  carBody.parent = pivot;
  carBody.position = new BABYLON.Vector3(0, 0, -50);
  
  /*---------------------End Create Car Centre of Rotation-------------------------*/
  
  
  /*************************** End Car*********************************************/
  
  /*****************************Add Ground********************************************/
  var groundSize = 400;
  
  var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: groundSize, height: groundSize}, scene);
  var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(0.75, 1, 0.25);
  ground.material = groundMaterial;
  ground.position.y = -1.5;
 /*****************************End Add Ground********************************************/ 
 
  /*****************************Particles to Show Movement********************************************/ 
  var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
  box.position = new BABYLON.Vector3(20, 0, 10);
  

 var boxesSPS = new BABYLON.SolidParticleSystem("boxes", scene, {updatable: false});
    
    //function to position of grey boxes
    var set_boxes = function(particle, i, s) {
        particle.position = new BABYLON.Vector3(-200 + Math.random()*400, 0, -200 + Math.random()*400); 
    }
    
    //add 400 boxes
    boxesSPS.addShape(box, 400, {positionFunction:set_boxes});  
    var boxes = boxesSPS.buildMesh(); // mesh of boxes
	boxes.material = new BABYLON.StandardMaterial("", scene);
	boxes.material.alpha = 0.25;
 /*****************************Particles to Show Movement********************************************/
 
 
 
   /****************************Key Controls************************************************/
  
  var map ={}; //object for multiple key presses
  scene.actionManager = new BABYLON.ActionManager(scene);
 
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {								
		map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
		
	}));
	
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {								
		map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
	}));	
	
  /****************************End Key Controls************************************************/
  
 
 /****************************Variables************************************************/
 
  var theta = 0;
  var deltaTheta = 0;
  var D = 0; //distance translated per second
  var R = 50; //turning radius, initial set at pivot z value
  var NR; //Next turning radius on wheel turn
  var A = 4; // axel length
  var L = 4; //distance between wheel pivots
  var r = 1.5; // wheel radius
  var psi, psiRI, psiRO, psFI, psiFO; //wheel rotations  
  var phi; //rotation of car when turning 
  
  var F; // frames per second	
  
  /****************************End Variables************************************************/
  

  
  /****************************Animation******************************************************/	
	
	scene.registerAfterRender(function() {	
		F = engine.getFps();
		
		if(map["ArrowUp"] && D < 15 ) {
			D += 1;		
		};
		
		if(D > 0.15) {
			D -= 0.15;
		} 
		else {
			D = 0;
		}
					
		// let distance = D/F;
		psi = D/(r * F);
		
		if((map["a"] || map["ArrowLeft"]) && -Math.PI/6 < theta) {
			deltaTheta = -Math.PI/252;
			theta += deltaTheta;
			pivotFI.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
			pivotFO.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
			if(Math.abs(theta) > 0.00000001) {
				NR = A/2 +L/Math.tan(theta);	
			}
			else {
				theta = 0;
				NR = 0;
			}
			// pivot.translate(BABYLON.Axis.Z, NR - R, BABYLON.Space.LOCAL);
			carBody.translate(BABYLON.Axis.Z, R - NR, BABYLON.Space.LOCAL);
			R = NR;
									
		};
			
		if((map["d"] || map["ArrowRight"])  && theta < Math.PI/6) {
			deltaTheta = Math.PI/252;
			theta += deltaTheta;
			pivotFI.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
			pivotFO.rotate(BABYLON.Axis.Y, deltaTheta, BABYLON.Space.LOCAL);
			if(Math.abs(theta) > 0.00000001) {
				NR = A/2 +L/Math.tan(theta);	
			}
			else {
				theta = 0;
				NR = 0;
			}
			// pivot.translate(BABYLON.Axis.Z, NR - R, BABYLON.Space.LOCAL);
			carBody.translate(BABYLON.Axis.Z, R - NR, BABYLON.Space.LOCAL);
			R = NR;
					
		};
		
		if(D > 0) {
			phi = D/(R * F);
			if(Math.abs(theta)>0) {	 
			 	// pivot.rotate(BABYLON.Axis.Y, phi, BABYLON.Space.WORLD);
				psiRI = D/(r * F);
				psiRO = D * (R + A)/(r * F);
				let psiFI = D * Math.sqrt(R* R + L * L)/(r * F);
				psiFO = D * Math.sqrt((R + A) * (R + A) + L * L)/(r * F);
			
				wheelFI.rotate(BABYLON.Axis.Y, psiFI, BABYLON.Space.LOCAL); 
	 			wheelFO.rotate(BABYLON.Axis.Y, psiFO, BABYLON.Space.LOCAL);
	 			wheelRI.rotate(BABYLON.Axis.Y, psiRI, BABYLON.Space.LOCAL);
	 			wheelRO.rotate(BABYLON.Axis.Y, psiRO, BABYLON.Space.LOCAL);
		 	}
		 	else {
			 	// pivot.translate(BABYLON.Axis.X, -distance, BABYLON.Space.LOCAL);
				wheelFI.rotate(BABYLON.Axis.Y, psi, BABYLON.Space.LOCAL); 
	 			wheelFO.rotate(BABYLON.Axis.Y, psi, BABYLON.Space.LOCAL);
	 			wheelRI.rotate(BABYLON.Axis.Y, psi, BABYLON.Space.LOCAL);
	 			wheelRO.rotate(BABYLON.Axis.Y, psi, BABYLON.Space.LOCAL);
		 	}
		}
	});
	
	/****************************End Animation************************************************/

  	return scene;
}