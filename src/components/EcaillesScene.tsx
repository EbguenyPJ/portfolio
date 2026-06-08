'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Props {
  className?: string
  colorTexture?: 'color' | 'color2'
  opacity?: number
}

export default function EcaillesScene({
  className = '',
  colorTexture = 'color2',
  opacity = 1,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ─── Constants ────────────────────────────────────────────
    const SPACING = 9
    const TOTAL   = 4096
    const COLS    = Math.floor(Math.sqrt(TOTAL))
    const ROWS    = Math.round(TOTAL / COLS)
    const BG      = 0x080808

    // ─── Renderer ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: opacity < 1 })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(BG, opacity < 1 ? 0 : 1)
    ;(renderer as unknown as { outputColorSpace: string }).outputColorSpace = THREE.SRGBColorSpace
    // physicallyCorrectLights removed in Three.js r155+
    mount.appendChild(renderer.domElement)

    // ─── Scene ────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(BG, 200, 400)

    // ─── Camera ───────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 0, 200)
    camera.lookAt(0, 0, 0)

    // ─── Lights ───────────────────────────────────────────────
    const light1 = new THREE.PointLight(0x2C323A, 3)
    light1.position.set(0, 0, 200)
    scene.add(light1)

    const light2 = new THREE.PointLight(0x56657C, 0.17)
    light2.position.set(0, 0, 300)
    scene.add(light2)

    // ─── Uniforms ─────────────────────────────────────────────
    const customUniforms = {
      mouse:          { value: new THREE.Vector2(0, 0) },
      time:           { value: 0.0 },
      ecailleMaxRot:  { value: new THREE.Vector3(0, 0, Math.PI) },
      gradientSpread: { value: 350.0 },
    }

    // ─── GLSL helpers (vertex) ────────────────────────────────
    const glslHelpers = /* glsl */`
      attribute vec3 instancePosition;
      attribute vec4 instanceQuaternion;
      attribute vec3 instanceScale;

      uniform vec3  ecailleMaxRot;
      uniform vec2  mouse;
      uniform float time;
      uniform float gradientSpread;

      vec4 quatFromEulerXYZ(vec3 euler) {
        float x = euler.x, y = euler.y, z = euler.z;
        float c1=cos(x*.5), c2=cos(y*.5), c3=cos(z*.5);
        float s1=sin(x*.5), s2=sin(y*.5), s3=sin(z*.5);
        return vec4(
          s1*c2*c3 + c1*s2*s3,
          c1*s2*c3 - s1*c2*s3,
          c1*c2*s3 + s1*s2*c3,
          c1*c2*c3 - s1*s2*s3
        );
      }

      vec4 quat_mult(vec4 q1, vec4 q2) {
        return vec4(
          q1.w*q2.x + q1.x*q2.w + q1.y*q2.z - q1.z*q2.y,
          q1.w*q2.y - q1.x*q2.z + q1.y*q2.w + q1.z*q2.x,
          q1.w*q2.z + q1.x*q2.y - q1.y*q2.x + q1.z*q2.w,
          q1.w*q2.w - q1.x*q2.x - q1.y*q2.y - q1.z*q2.z
        );
      }

      vec3 applyTRS(vec3 position, vec3 translation, vec4 quaternion, vec3 scale) {
        position *= scale;
        position += 2.0 * cross(quaternion.xyz, cross(quaternion.xyz, position) + quaternion.w * position);
        return position + translation;
      }

      mat3 myInverse(mat3 m) {
        float a00=m[0][0], a01=m[0][1], a02=m[0][2];
        float a10=m[1][0], a11=m[1][1], a12=m[1][2];
        float a20=m[2][0], a21=m[2][1], a22=m[2][2];
        float b01= a22*a11 - a12*a21;
        float b11=-a22*a10 + a12*a20;
        float b21= a21*a10 - a11*a20;
        float det = a00*b01 + a01*b11 + a02*b21;
        return mat3(b01,(-a22*a01+a02*a21),(a12*a01-a02*a11),
                    b11,(a22*a00-a02*a20),(-a12*a00+a02*a10),
                    b21,(-a21*a00+a01*a20),(a11*a00-a01*a10)) / det;
      }

      mat4 getInstanceMatrix(vec4 quaternion, vec3 scale, vec3 position) {
        vec4 q  = quaternion;
        vec3 s  = scale;
        vec3 v  = position;
        vec3 q2 = q.xyz + q.xyz;
        vec3 a  = q.xxx * q2.xyz;
        vec3 b  = q.yyz * q2.yzz;
        vec3 c  = q.www * q2.xyz;
        vec3 r0 = vec3(1.0-(b.x+b.z),  a.y+c.z,        a.z-c.y)        * s.x;
        vec3 r1 = vec3(a.y-c.z,         1.0-(a.x+b.z),  b.y+c.x)        * s.y;
        vec3 r2 = vec3(a.z+c.y,         b.y-c.x,         1.0-(a.x+b.x)) * s.z;
        return mat4(r0,0., r1,0., r2,0., v,1.);
      }

      vec4 _iQuat;
      vec3 _iPos;

      varying float vFlip;
      varying vec2 vInstanceUV;
    `

    // ─── Material builder ─────────────────────────────────────
    function buildMaterial(
      colorMap: THREE.Texture,
      metalRoughAOMap: THREE.Texture,
      envMap: THREE.Texture,
    ) {
      colorMap.colorSpace = THREE.SRGBColorSpace
      colorMap.flipY      = false
      metalRoughAOMap.flipY = false

      const mat = new THREE.MeshStandardMaterial({
        metalnessMap:    metalRoughAOMap,
        aoMap:           metalRoughAOMap,
        metalness:       0.0,
        roughness:       0.14,
        envMap,
        envMapIntensity: 0.35,
        side:            THREE.DoubleSide,
      })

      mat.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, customUniforms)
        shader.uniforms.backColor = { value: new THREE.Color(0x080808) }
        shader.uniforms.tColor    = { value: colorMap }

        shader.fragmentShader = `
          uniform vec3 backColor;
          uniform sampler2D tColor;
          varying float vFlip;
          varying vec2 vInstanceUV;
        ` + shader.fragmentShader
          .replace('#include <map_fragment>', '')
          .replace('#include <color_fragment>', `
            #include <color_fragment>
            vec2 colorUV = mix(vec2(0.95, 0.95), vec2(0.02, 0.02), vFlip);
            vec4 instanceColor = texture2D(tColor, colorUV);
            diffuseColor.rgb = instanceColor.rgb;
          `)

        shader.vertexShader = glslHelpers + shader.vertexShader
          .replace('#include <beginnormal_vertex>', `
            _iPos    = instancePosition;
            _iPos.y  = cos(time + instancePosition.z * 0.05) * 2.0;

            vec3 _p = -(modelViewMatrix * vec4(_iPos, 1.0)).xyz;

            float gradientLength = gradientSpread * ((sin(_p.y * 0.03) + 2.0) / 10.0);
            float d = clamp((_p.x - mouse.x + gradientLength * 0.5) / gradientLength, 0.0, 1.0);

            vFlip = step(0.5, d);
            vInstanceUV = vec2(0.95, 0.95);

            vec3 rot  = ecailleMaxRot * d;
            _iQuat    = quat_mult(quatFromEulerXYZ(rot), instanceQuaternion);

            mat4 _instanceMatrix = getInstanceMatrix(_iQuat, instanceScale, _iPos);

            vec3 objectNormal = normal;
            // Inline inverse-transpose for normals (avoids transposeMat3 / transpose builtins)
            mat3 invM = myInverse(mat3(modelViewMatrix * _instanceMatrix));
            mat3 invTM = mat3(invM[0][0], invM[1][0], invM[2][0],
                              invM[0][1], invM[1][1], invM[2][1],
                              invM[0][2], invM[1][2], invM[2][2]);
            vec3 transformedNormal = invTM * objectNormal;
            #ifdef FLIP_SIDED
              transformedNormal = -transformedNormal;
            #endif
            vNormal = normalize(transformedNormal);
          `)
          .replace('#include <defaultnormal_vertex>', '')
          .replace('#include <begin_vertex>', `
            vec3 transformed = applyTRS(position, _iPos, _iQuat, instanceScale);
          `)
      }

      return mat
    }

    // ─── Load assets ──────────────────────────────────────────
    const bufLoader = new THREE.BufferGeometryLoader()
    const texLoader = new THREE.TextureLoader()

    let animId: number
    let geometries: THREE.BufferGeometry[] = []
    let materials:  THREE.Material[]       = []
    let textures:   THREE.Texture[]        = []

    const colorFile = colorTexture === 'color2' ? 'color2.png' : 'color.png'

    const envTexPromise = new Promise<THREE.Texture>((res) => {
      const t = texLoader.load('/models/env.jpg', () => res(t))
      t.mapping   = THREE.EquirectangularReflectionMapping
      t.minFilter = t.magFilter = THREE.LinearFilter
    })

    Promise.all([
      new Promise<THREE.BufferGeometry>((res) => bufLoader.load('/models/ecaille2.json', res)),
      new Promise<THREE.Texture>((res) => texLoader.load(`/models/new/${colorFile}`, res)),
      new Promise<THREE.Texture>((res) => texLoader.load('/models/new/metalroughao.png', res)),
      envTexPromise,
    ]).then(([baseGeo, colorMap, metalRoughAOMap, envMap]) => {
      if (!mount) return
      textures = [colorMap, metalRoughAOMap, envMap]
      scene.environment = envMap

      // Instance geometry
      const instGeo = new THREE.InstancedBufferGeometry()
      instGeo.attributes.position = baseGeo.attributes.position.clone()
      instGeo.attributes.normal   = baseGeo.attributes.normal.clone()
      if (baseGeo.attributes.uv)  instGeo.attributes.uv  = baseGeo.attributes.uv.clone()
      if (baseGeo.attributes.uv2) instGeo.attributes.uv2 = baseGeo.attributes.uv2.clone()
      else if (baseGeo.attributes.uv) instGeo.attributes.uv2 = baseGeo.attributes.uv.clone()
      instGeo.setIndex(baseGeo.index!.clone())
      instGeo.instanceCount = TOTAL
      geometries = [baseGeo, instGeo]

      const halfW = COLS * SPACING * 0.5
      const halfH = ROWS * SPACING * 0.5
      const posArr   = new Float32Array(TOTAL * 3)
      const quatArr  = new Float32Array(TOTAL * 4)
      const scaleArr = new Float32Array(TOTAL * 3)
      const euler    = new THREE.Euler()
      const q        = new THREE.Quaternion()

      for (let c = 0; c < TOTAL; c++) {
        const row = Math.floor(c / COLS)
        const col = c % COLS
        let h = col * SPACING - halfW
        const p = row * SPACING - halfH
        if (row % 2 === 0) h += 0.5 * SPACING
        euler.set(0, Math.PI * Math.sin(col * c * 5e-5), 0)
        q.setFromEuler(euler).normalize()
        posArr[c*3]     = h;  posArr[c*3+1] = 0; posArr[c*3+2] = p
        quatArr[c*4]    = q.x; quatArr[c*4+1] = q.y; quatArr[c*4+2] = q.z; quatArr[c*4+3] = q.w
        scaleArr[c*3]   = 1;  scaleArr[c*3+1] = 1; scaleArr[c*3+2] = 1
      }

      instGeo.setAttribute('instancePosition',   new THREE.InstancedBufferAttribute(posArr, 3))
      instGeo.setAttribute('instanceQuaternion', new THREE.InstancedBufferAttribute(quatArr, 4))
      instGeo.setAttribute('instanceScale',      new THREE.InstancedBufferAttribute(scaleArr, 3))

      const mat  = buildMaterial(colorMap, metalRoughAOMap, envMap)
      materials  = [mat]
      const mesh = new THREE.Mesh(instGeo, mat)
      mesh.rotation.x = 0.5 * Math.PI
      scene.add(mesh)

      const pickMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(COLS * SPACING, ROWS * SPACING),
        new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }),
      )
      pickMesh.position.x = -0.25 * SPACING
      pickMesh.position.y =  0.5  * SPACING
      scene.add(pickMesh)
      geometries.push(pickMesh.geometry)
      materials.push(pickMesh.material as THREE.Material)

      // ─── Mouse ──────────────────────────────────────────────
      const mouse2D  = new THREE.Vector2()
      const hitPoint = new THREE.Vector3()
      const smoothed = new THREE.Vector3()
      const ray      = new THREE.Raycaster()

      const onMouseMove = (e: MouseEvent) => {
        mouse2D.x =  (e.clientX / window.innerWidth)  * 2 - 1
        mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1
      }
      window.addEventListener('mousemove', onMouseMove)

      // ─── Loop ───────────────────────────────────────────────
      let last = performance.now()
      let elapsed = 0

      const loop = () => {
        animId = requestAnimationFrame(loop)
        const now = performance.now()
        const dt  = now - last; last = now
        elapsed  += dt

        light1.position.y = 200 * Math.cos(5e-4 * elapsed)
        light2.position.y = 300 * Math.sin(5e-4 * elapsed)

        ray.setFromCamera(mouse2D, camera)
        const hits = ray.intersectObject(pickMesh)
        if (hits.length) hitPoint.copy(hits[0].point)

        smoothed.x += 0.1 * (hitPoint.x - smoothed.x)
        smoothed.y += 0.1 * (hitPoint.y - smoothed.y)
        smoothed.z += 0.1 * (hitPoint.z - smoothed.z)

        customUniforms.mouse.value.set(-smoothed.x, -smoothed.y)
        customUniforms.time.value += 0.001 * dt

        renderer.render(scene, camera)
      }
      loop()

      // Store for cleanup
      ;(mount as unknown as { _ecaillesCleanup: () => void })._ecaillesCleanup = () => {
        window.removeEventListener('mousemove', onMouseMove)
      }
    })

    // ─── Resize ───────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ─── Cleanup ──────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      ;(mount as unknown as { _ecaillesCleanup?: () => void })._ecaillesCleanup?.()
      geometries.forEach((g) => g.dispose())
      materials.forEach((m) => m.dispose())
      textures.forEach((t) => t.dispose())
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [colorTexture, opacity])

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ opacity }}
    />
  )
}
