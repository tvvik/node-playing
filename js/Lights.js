	var light = new THREE.AmbientLight( 0xACC2C2 ); // soft white light
	scene.add( light );
	var spot_light = new THREE.PointLight( 0xACC2C2, 0.6, 30000 ); 
	spot_light.position.set(0,0,0);
	camera.add(spot_light);
	scene.add( spot_light );
	scene.fog = new THREE.Fog(0x7EB7B7,15, 8000);

	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 13370,7902,-126 );
	spotLight.target.position = cube.position;
	spotLight.castShadow = true;
	renderer.shadowMapBias = 0.00039;
	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;
	spotLight.shadowCameraNear = 50;
	spotLight.shadowCameraFar = 40000;
	spotLight.shadowCameraFov = 16;
	spotLight.shadowDarkness = 0.3;
//	spotLight.shadowCameraVisible = true;
	scene.add( spotLight );