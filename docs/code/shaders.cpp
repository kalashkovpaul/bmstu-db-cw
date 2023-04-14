float getDistance(vec3 rayOrigin, vec3 rayDirection,
    out vec3 rayPosition, out vec3 normal, out bool hit) {
  float dist;
  float depth = 0.0;
  rayPosition = rayOrigin;
  for (int i = 0; i < 64; i++){
    dist = sceneDist(rayPosition);
    if (abs(dist) < EPS) {
      hit = true;
      break;
    }
    depth += dist;
    rayPosition = rayOrigin + depth * rayDirection;
  }
  return depth;
}

float distance(vec3 p) {
  float cube = cubeDist(rotate(translate(p, cubePosition),
    cubeRotation),
  vec3(cubeScale * 2., cubeScale * 2., cubeScale * 2.));
  float cylinder = cylinderDist(rotate(translate(p,
    cylinderPosition),cylinderRotation), cylinderScale * 0.5,
    cylinderScale * 4.0);
  float sphere = sphereDist(translate(p, spherePosition),
    sphereScale * 1.);
  float torus = torusDist(rotate(translate(p, torusPosition),
    torusRotation), vec2(1.0 * torusScale, 0.25 * torusScale));
  return union(cube, difference(sphere, cylinder));
}