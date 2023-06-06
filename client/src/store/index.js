import { proxy } from "valtio";

const state = proxy({
    intro: true,
    color:'#EFBD4E',
    isLogoTexture: true,
    isFullTexture: true,
    logoDecal:"./threejs.png",
    fullDecal:'./react.png',
    logoSize:25
});

export default state;