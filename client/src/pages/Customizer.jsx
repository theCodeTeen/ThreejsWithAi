import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import config from "../config/config";
import state from '../store';
import {download} from "../assets";
import {downloadCanvasToImage, reader} from "../config/helpers";
import {EditorTabs, FilterTabs, DecalTypes} from "../config/constants";
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file,setFile] = useState('');
  const [prompt,setPrompt] = useState('');
  const [generatingImg,setGeneratingImg] = useState("");
  const [activeEditorTab,setActiveEditorTab] = useState(false);
  const [activeFilterTab,setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: true
  });

  const generateTabContent = ()=>{
    switch(activeEditorTab){
        case "colorpicker":
            return <ColorPicker/>;
        case "filepicker":
            return <FilePicker
            file={file}
            setFile={setFile}
            readFile={readFile}
            />;
        case "aipicker":
            return <AIPicker
                prompt = {prompt}
                setPrompt = {setPrompt}
                generatingImg = {generatingImg}
                handleSubmit = {handleSubmit}
            />;
        default:
            return null;
    }
  }

  const handleSubmit = async (type)=>{
    if(!prompt) return alert("Please enter a prompt!");

    try{
        setGeneratingImg(true);

        const response = await fetch('https://ai-image-generation-with-dalle.onrender.com/api/v1/dalle',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                prompt
            })
        });

        const data = await response.json();

        handleDecals(type,`data:image/png;base64,${data.photo}`)
    }catch(err){
        if(err==`SyntaxError: Unexpected token 'T', "Too many r"... is not valid JSON`){ 
            alert("Cannot send more than 2 request per 30 mins.."); 
        } else
        alert(err);
    }
    finally{
        setGeneratingImg(false);
        setActiveEditorTab("")
    }
  }

  const handleDecals = (type,result)=>{
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.filterTab]){
        handleActiveFilterTab(decalType.filterTab);
    }
  }

  const handleActiveFilterTab = (tabName) =>{
    switch(tabName){
        case "logoShirt":
            state.isLogoTexture = !activeFilterTab[tabName];
            break;
        case "stylishShirt":
            state.isFullTexture = !activeFilterTab[tabName];
            break;
        default:
            state.isLogoTexture = true;
            state.isFullTexture = false;
    }

    setActiveFilterTab(state=>{
        return {
            ...state,
            [tabName]:!state[tabName]
        }
    })
  }
  const readFile = (type)=>{
    reader(file)
    .then((result)=>{
        handleDecals(type,result);
        setActiveEditorTab("");
    })
  }

  const sliderChangeHandler = (e)=>{
    state.logoSize = e.target.value;
    console.log(e.target.value);
  }
  return (
    <AnimatePresence>
        {!snap.intro && (
            <>
               <motion.div 
                key="custom"
                className='absolute top-0 left-0 z-10'
                {...slideAnimation('left')}
                >
                    <div className='flex items-center min-h-screen'>
                        <div className='editortabs-container tabs'>
                            {
                                EditorTabs.map((tab)=>{
                                    return <Tab 
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={()=>setActiveEditorTab(tab.name)}
                                    />
                                })
                            }
                            {generateTabContent()}
                        </div>
                    </div>
                </motion.div>
                <motion.div className='absolute z-10 top-5 right-5' {...fadeAnimation}>
                    <CustomButton
                        type={'filled'}
                        title={"Go Back"}
                        handleClick={()=> state.intro = true}
                        customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                    />
                </motion.div>
                <motion.div
                    className='filtertabs-container'
                    {...slideAnimation('up')}
                >
                            {
                                FilterTabs.map((tab)=>{
                                    return <Tab 
                                        key={tab.name}
                                        tab={tab}
                                        isFilterTab
                                        isActiveTab={activeFilterTab[tab.name]}
                                        handleClick={()=>handleActiveFilterTab(tab.name)}
                                    />
                                })
                            }
                </motion.div>
                <motion.div
                    className="absolute top-5 left-5 z-10 " {...fadeAnimation}
                >
                        <input style={{ '-webkit-slider-thumb ': 'red' }} className={"rangenput"} type='range' min="1" max="100" value={snap.logoSize} onChange={sliderChangeHandler}/>
                </motion.div>
            </>
        )}
    </AnimatePresence>
  )
}

export default Customizer