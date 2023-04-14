/*
 * Операция переноса
 */
vec3 translate(vec3 p, vec3 v) {
  return p - v;
}

/*
 * Операция поворота
 */
vec3 rotate(vec3 p, vec3 rad) {
  float x = rad.x;
  float y = rad.y;
  float z = rad.z;
  mat3 m = mat3(
    cos(y)*cos(z),
    sin(x)*sin(y)*cos(z) - cos(x)*sin(z),
    cos(x)*sin(y)*cos(z) + sin(x)*sin(z),

    cos(y)*sin(z),
    sin(x)*sin(y)*sin(z) + cos(x)*cos(z),
    cos(x)*sin(y)*sin(z) - sin(x)*cos(z),

    -sin(y),
    sin(x)*cos(y),
    cos(x)*cos(y)
  );
  return m * p;
}