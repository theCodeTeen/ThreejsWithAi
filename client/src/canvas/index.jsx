import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, Environment } from '@react-three/drei'
import Shirt from './Shirt'
import Backdrop from './Backdrop'
import CameraRig from './CameraRig'


const CanvasModel = () => {
  return (
    <Canvas
        shadows
        camera={{position:[0,0,0], fov:25}}
        gl={{preserveDrawingBuffer:true}}
        className='w-full max-w-full h-full transition-all ease-in'
    >
      <color attach="background" args={['#f3f3f3']} />
        <ambientLight intensity={0.5}/>
        {/* <Environment preset="forest"/> */}
        <CameraRig>
            {/* <Backdrop/> */}
            <Center>
                <Shirt/>
            </Center>
        </CameraRig>
    </Canvas>
  )
}

export default CanvasModel